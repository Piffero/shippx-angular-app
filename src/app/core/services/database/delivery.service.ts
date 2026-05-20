import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { StorageService } from '../storage/storage.service';
import { Order } from '../../models/shippx/order.model';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  
  private _client = inject(SupabaseService).client;
  private _storage = inject(StorageService);

  // Armazena temporariamente os caminhos após upload bem-sucedido
  private _currentPhotoPath: string | null = null;
  private _currentSignaturePath: string | null = null;

  //Faz o upload da foto de entrega e salva o caminho para uso posterior
  async uploadDeliveryPhoto(orderId: number, photo: File) {
    const path = `deliveries/${orderId}/photos/photo_${Date.now()}.jpg`;
    const { data, error } = await this._storage.uploadFile('shippx-bucket', path, photo);
    if (error) throw error;
    this._currentPhotoPath = data.path; // Salva o estado para o próximo passo
    return data.path;
  }

  // Faz o upload da assinatura de entrega e salva o caminho para uso posterior
  async uploadDeliverySignature(orderId: number, signature: File) {
    const path = `deliveries/${orderId}/signatures/signature_${Date.now()}.jpg`;
    const { data, error } = await this._storage.uploadFile('shippx-bucket', path, signature);
    if (error) throw error;
    this._currentSignaturePath = data.path; // Salva o estado para o próximo passo
    return data.path;
  }

  //Finaliza a entrega: atualiza o status da entrega e associa os arquivos de foto e assinatura
  async finalizeDelivery(orderId: number, deliveryData: any) {
    if (!this._currentPhotoPath || !this._currentSignaturePath) {
      throw new Error("Arquivos obrigatórios ausentes.");
    }

    // Atualiza a Entrega (Contexto do Motorista)
    const { data, error } = await this._client
      .from('deliveries')
      .update({ 
        status: 'entregue', 
        foto_entrega_url: this._currentPhotoPath, 
        assinatura_bar: this._currentSignaturePath,
        updated_at: new Date().toISOString()
      })
      .eq('order_id', orderId); // Use order_id conforme discutido

    if (!error) {
      // Limpa o estado após sucesso
      this._currentPhotoPath = null;
      this._currentSignaturePath = null;
    }

    throw new Error(`Erro ao atualizar o status da entrega: ${error?.message}`);
  }

  // Aceita uma entrega disponível
  async acceptOrder(orderId: string) {
    return await this._client
      .from('deliveries')
      .insert({ 
        order_id: orderId,
        status: 'em_transito' 
      });
  }

  async getMyPastDeliveries(): Promise<Order[]> {
    try {
      const { data: { user }, error: authError } = await this._client.auth.getUser();
      if (authError || !user) throw new Error('Usuário não autenticado.');

      // Busca na tabela 'deliveries' registros concluídos ('entregue') deste motorista
      const { data, error } = await this._client
        .from('deliveries')
        .select(`
          id,
          status,
          carrier_id,
          order_id,
          orders (
            id,
            status,
            endereco_entrega,
            cep_entrega,
            valor_total,
            nf_e_chave,
            updated_at
          )
        `)
        .eq('carrier_id', user.id)
        .eq('status', 'entregue')
        .order('updated_at', { foreignTable: 'orders', ascending: false });

      if (error) throw error;

      // Filtra e mapeia os resultados para retornar a lista de Orders
      if (!data) return [];
      return data
        .filter(d => d.orders !== null)
        .map(d => d.orders as unknown as Order);

    } catch (error) {
      console.error('Erro ao buscar histórico de entregas:', error);
      throw error;
    }
  }

  async getMyActiveDelivery(): Promise<Order | null> {
    try {
      // 1. Obtém o usuário autenticado
      const { data: { user }, error: authError } = await this._client.auth.getUser();
      if (authError || !user) throw new Error('Usuário não autenticado.');

      // 2. Busca na tabela 'deliveries' um registro do motorista com status 'em_andamento'
      // Fazendo o JOIN para trazer os dados da tabela 'orders' associada
      const { data, error } = await this._client
        .from('deliveries')
        .select(`
          id,
          status,
          carrier_id,
          order_id,
          orders (
            id,
            status,
            endereco_entrega,
            cep_entrega,
            valor_total,
            nf_e_chave,
            updated_at
          )
        `)
        .eq('carrier_id', user.id)
        .eq('status', 'em_andamento')
        .maybeSingle(); // Retorna um objeto ou null se não achar nada

      if (error) throw error;
      
      // Retorna a ordem formatada se existir
      return data && data.orders ? (data.orders as unknown as Order) : null;

    } catch (error) {
      console.error('Erro ao buscar entrega ativa:', error);
      throw error;
    }
  }

  async updateDeliveryCte(deliveryId: string, cteKey: string) {
    const { data, error } = await this._client
      .from('deliveries')
      .update({ cte_chave: cteKey })
      .eq('id', deliveryId);

    if (error) throw error;
    
    return data;
  }
}
