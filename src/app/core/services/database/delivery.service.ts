import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { StorageService } from '../storage/storage.service';

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
  async finalizeDelivery(orderId: number) {
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
  async acceptOrder(orderId: string, driverId: string) {
    return await this._client
      .from('deliveries')
      .insert({ 
        order_id: orderId, 
        driver_id: driverId, 
        status: 'em_transito' 
      });
  }
}
