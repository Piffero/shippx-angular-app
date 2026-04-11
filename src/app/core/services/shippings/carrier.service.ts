import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../authflow/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CarrierService {
  private supabase = inject(SupabaseService).client;

  /**
   * Atualiza os dados do veículo do transportador
   * @param vehicleData Dados vindos do formulário rd-setting-vehicle
   */
  async updateVehicleProfile(vehicleData: any) {
    // 1. Obtém o usuário logado
    const { data: { user } } = await this.supabase.auth.getUser();
    
    if (!user) throw new Error('Sessão expirada ou usuário não identificado.');

    // 2. Prepara o payload para a tabela de perfis de transportadores (carriers_vehicles)
    // Usamos upsert para criar ou atualizar baseado no user_id
    const payload = {
      user_id: user.id,
      vehicle_type: vehicleData.type,
      vehicle_model: vehicleData.model,
      license_plate: vehicleData.license_plate.toUpperCase(),
      capacity_volume: vehicleData.capacity_volume,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from('carriers_vehicles') // Certifique-se que este nome bate com seu banco
      .upsert(payload, { onConflict: 'user_id' })
      .select();

    if (error) {
      console.error('Erro ao salvar veículo no Supabase:', error.message);
      throw error;
    }

    return data;
  }

  /**
   * Busca as configurações atuais do veículo do motorista
   */
  async getMyVehicle() {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await this.supabase
      .from('carriers_vehicles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) return null;
    return data;
  }

  /**
   * Busca hubs que possuem pacotes aguardando coleta
   */
  async getAvailableOpportunities() {
    // Buscamos os pacotes agrupando por hub_id
    // Dica: Em uma escala maior, usaríamos uma RPC (Stored Procedure) no Postgres
    const { data, error } = await this.supabase
      .from('shipments')
      .select(`
        hub_id,
        partner_hubs (
          id,
          name,
          address,
          latitude,
          longitude
        )
      `)
      .eq('status', 'IN_HUB'); // Apenas o que já foi bipado pelo dono do posto

    if (error) throw error;

    // Lógica de Agrupamento (Transforma lista de pacotes em lista de Oportunidades)
    const opportunities = data.reduce((acc: any, curr: any) => {
      const hubId = curr.hub_id;
      if (!acc[hubId]) {
        acc[hubId] = {
          hub: curr.partner_hubs,
          total_packages: 0,
          estimated_payout: 0
        };
      }
      acc[hubId].total_packages += 1;
      acc[hubId].estimated_payout += 2.50; // Exemplo: R$ 2,50 por pacote coletado
      return acc;
    }, {});

    return Object.values(opportunities);
  }
}
