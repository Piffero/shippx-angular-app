import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private supabase = inject(SupabaseService).client;

  async getMyPackages() {
    return await this.supabase.from('shipments').select('*, partner_hubs(*)');
  }

  /**
   * Atualiza o status de um pacote e vincula ao Hub responsável
   * @param packageId ID interno do pacote (uuid)
   * @param newStatus Novo estado (ex: 'IN_HUB', 'COLLECTED')
   * @param hubId ID do usuário que representa o Posto de Coleta
   */
  async updateStatus(packageId: string, newStatus: string, hubId?: string) {
    const updateData: any = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    // Se o status for entrada no posto, registramos qual Hub recebeu
    if (newStatus === 'IN_HUB' && hubId) {
      updateData.hub_id = hubId;
    }

    const { data, error } = await this.supabase
      .from('shipments')
      .update(updateData)
      .eq('id', packageId)
      .select(); // Retorna o dado atualizado para confirmação

    if (error) {
      console.error('Erro ao atualizar status:', error.message);
      throw error;
    }

    return data;
  }

  // Busca um único pacote pelo ID (usado no scanner do Hub)
  async getPackageById(id: string) {
    const { data, error } = await this.supabase
      .from('shipments')
      .select('*, partner_hubs(name)')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  }

  // Escuta mudanças em tempo real apenas para pacotes
  subscribeToPackageUpdates(callback: (payload: any) => void) {
    return this.supabase
      .channel('package-tracking')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shipments' }, callback)
      .subscribe();
  }
}
