import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from '../authflow/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HubService {
  
  private supabase = inject(SupabaseService).client;
  private auth = inject(AuthService);

  async getAllHubs() {
    // Busca nome, endereço, latitude e longitude da tabela partner_hubs
    const { data, error } = await this.supabase
      .from('partner_hubs')
      .select('id, name, address, latitude, longitude, status')
      .eq('status', 'active');
    
    if (error) throw error;
    return data;
  }

  async getHubByOwnerId(ownerId: string) {
    const { data, error } = await this.supabase
      .from('partner_hubs')
      .select('*')
      .eq('owner_id', ownerId)
      .single();

    if (error) {
      // PGRST116 é o código para "No rows found", o que é um estado válido
      if (error.code === 'PGRST116') return null;
      
      console.error('Erro ao buscar Hub:', error.message);
      throw error;
    }

    return data;
  }

  async updateHubProfile(hubData: any) {
    // 1. Pegamos o ID do usuário logado para garantir o vínculo correto
    const user = await this.auth.getUser(); // Assumindo que seu AuthService retorna o user
    
    if (!user) throw new Error('Usuário não autenticado');

    // 2. Preparamos o objeto para o Supabase (Upsert)
    // O upsert insere se não existir ou atualiza se o user_id já estiver lá
    const payload = {
      owner_id: user.id,
      name: hubData.name,
      address: hubData.address,
      city: hubData.city,       // ADICIONADO: Obrigatório no banco
      state: hubData.state,     // ADICIONADO: Obrigatório no banco
      open_time: hubData.open_time,
      close_time: hubData.close_time,
      latitude: hubData.latitude,
      longitude: hubData.longitude,
      status: 'active', // Posto fica ativo ao salvar configurações
      updated_at: new Date().toISOString()
    };

    const { data, error } = await this.supabase
      .from('partner_hubs')
      .upsert(payload, { onConflict: 'owner_id' }) // Evita duplicatas para o mesmo usuário
      .select();

    if (error) {
      console.error('Erro ao salvar Hub:', error.message);
      throw error;
    }

    return data;
  }
}
