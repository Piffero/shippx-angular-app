import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../authflow/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CarrierService {
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);

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
}
