import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseAuthService } from './supabase-auth.service';
import { shippingRoutes } from '../../features/shippx/inner/shipping/shipping.router';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);
  private readonly PENDING_SHIP_KEY = 'shippx_pending_shipment';

  private _authService = inject(SupabaseAuthService);

  // Signal para armazernar a remessa em rascunho
  currentShipment = signal<any>(null);

  constructor() {
    // ao iniciar o serviço, tentamos carregar a remessa em rascunho do localStorage
    const pendingShipment = localStorage.getItem(this.PENDING_SHIP_KEY);
    if (pendingShipment) { this.currentShipment.set(JSON.parse(pendingShipment)); }
  }

  // Busca as categorias de remessa do Supabase
  async fetchShipmentCategories(): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('shipment_categories')
      .select('*');
    return { data, error }
  }

  // Busca subcategorias de remessa com base na categoria selecionada
  async fetchShipmentSubCategories(categoryId: string): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('shipment_subcategories')
      .select('*')
      .eq('category_id', categoryId)
      .order('category_id', { ascending: true }) // Primeiro critério
      .order('id', { ascending: true });        // Segundo critério
    return { data, error }
  }

  // Salva a remessa em rascunho no localStorage
  saveDraftShipment(shipmentData: any): void {
    this.currentShipment.set(shipmentData);
    localStorage.setItem(this.PENDING_SHIP_KEY, JSON.stringify(shipmentData));
  }

  // Limpa a remessa em rascunho do localStorage
  clearDraftShipment(): void {
    this.currentShipment.set(null);
    localStorage.removeItem(this.PENDING_SHIP_KEY);
  }

  // salva a remessa no Supabase (ainda não implementado, apenas um esqueleto)
  async saveShipment(shipmentData: any): Promise<{ data: any | null; error: any }> {
    const minFreight = this.calculateMinFreight(shipmentData); // Lógica baseada na tabela ANTT
    shipmentData.minimum_freight_value = minFreight;

    const { data, error } = await this.supabase
      .from('shipments')
      .insert(shipmentData)
      .select();

    return { data, error };
  }

  async claimShipment(token: string, userId: string): Promise<{ data: any[] | null; error: any }> {
    const { data, error } = await this.supabase
      .from('shipments')
      .update({
        user_id: userId,
        status: 'PUBLISHED',
        temp_token: null // Removemos o tokem por segurança
      })
      .eq('temp_token', token)
      .select();

    return { data, error };
  }

  async reconcileMyShipments(userId: string, orgId: string | null) {
    const token = localStorage.getItem('shippx_temp_token');
    if (!token) return;

    const { data, error } = await this.supabase
      .from('shipments')
      .update({ 
        user_id: userId, 
        organization_id: orgId,
        status: 'PUBLISHED', // Muda de AWAITING_AUTH para PUBLISHED
        temp_token: null     // Limpa o token para não reconciliar de novo
      })
      .eq('temp_token', token)
      .select();

    if (!error) {
      localStorage.removeItem('shippx_temp_token');
      console.log('Remessa reconciliada com sucesso!', data);
    }
  }

  async getMyShipments() {
    const user = this._authService.currentProfileValue;
    if (!user) return { data: [], error: 'Usuário não autenticado' };
    
    return await this.supabase
      .from('shipments')
      .select('*')
      .eq('organization_id', user.organization_id)
      .order('created_at', {ascending: false});
  }

  async getAvailableOpportunities(filters?: { 
    categories?: string[], 
    minWeight?: number | null, 
    maxWeight?: number | null,
    location?: string,
    startDate?: string | null, 
  }) {
    let query = this.supabase
      .from('shipments')
      .select(`*, shipment_categories(id, name, icon_url)`)
      .eq('status', 'PUBLISHED') // Apenas cargas abertas      
    
    // Filtro por Categorias (Array de IDs)
    if (filters?.categories?.length) {
      query = query.in('category_id', filters.categories);
    }

    // Filtro por Peso (Acessando JSONB shippx_details -> dimensions -> weight)
    if (filters?.minWeight) {
      query = query.gte('shippx_details->dimensions->>weight', filters.minWeight);
    }
    if (filters?.maxWeight) {
      query = query.lte('shippx_details->dimensions->>weight', filters.maxWeight);
    }

    // Filtro por Local (Busca parcial na cidade/endereço do pickup_location dentro do JSONB)
    if (filters?.location) {
      query = query.ilike('shippx_details->pickup_location->>city', `%${filters.location}%`);
    }

    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate);
    }

    return await query.order('created_at', { ascending: false });
  }

  // No seu serviço, ao buscar para a "vitrine" (público/carrier)
  async getQuotesForPublic(shipmentId: string) {
    return await this.supabase
      .from('shipment_quotes')
      .select('id, amount, created_at, pickup_window, delivery_window') // Omitimos dados do transportador
      .eq('shipment_id', shipmentId)
      .order('amount', { ascending: true });
  }

  // Ao buscar para o CLIENTE (Dono da carga)
  async getQuotesForOwner(shipmentId: string) {
    return await this.supabase
      .from('shipment_quotes')
      .select(`
        *,
        carrier:user_profiles (full_name, avatar_url) -- Traz tudo para o dono escolher
      `)
      .eq('shipment_id', shipmentId);
  }

  async getShipmentById(id: string) {
    return await this.supabase
      .from('shipments')
      .select('*, shipment_categories(id, name, icon_url)')
      .eq('id', id)
      .single();
  }

  // Busca as perguntas públicas de uma remessa
  async getQuestsForPublic(shipmentId: string) {
    return await this.supabase
      .from('shipment_questions')
      .select('*')
      .eq('shipment_id', shipmentId)
      .order('created_at', { ascending: true });
  }

  // Insere um novo orçamento (Citação)
  async insertQuote(bidData: any) {
    const { data: shipment } = await this.getShipmentById(bidData.shipment_id);
    if (shipment && bidData.amount < shipment.minimum_freight_value) {
      return { data: null, error: { message: `Seu lance de R$${bidData.amount} está abaixo do piso mínimo da ANTT (R$${shipment.minimum_freight_value}).`} };
    }

    return await this.supabase
      .from('shipment_quotes')
      .insert(bidData)
      .select();
  }

  // Insere uma nova pergunta
  async insertQuestion(shipmentId: string, questionText: string) {
    const user = this._authService.currentProfileValue;
    return await this.supabase
      .from('shipment_questions')
      .insert({
        shipment_id: shipmentId,
        user_id: user?.id,
        question_text: questionText
      })
      .select();
  }


  // Lógica simplificada baseada na estrutura da ANTT
  private calculateMinFreight(shipmentData: any): number {
    const km = shipmentData.shippx_details?.distance_km || 0;
    const eixos = shipmentData.shippx_details?.vehicle_axes || 2;
    const tipoCarga = shipmentData.shippx_details?.cargo_type || 'GERAL';

    // Exemplo de valores hipotéticos (Basear-se na tabela vigente da ANTT)
    const custoKm = 2.50 * eixos; 
    const custoFixo = 250.00; 

    return custoFixo + (custoKm * km);
  }

}
