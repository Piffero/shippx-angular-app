import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { PixChargeRequest } from '../../models/shered/pix-charge.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private _supabase = inject(SupabaseService);
  private _client = this._supabase.client;

  // Gera uma cobrança PIX via Woovi/OpenPix e retorna os dados para o frontend exibir o QR Code e o código de pagamento
  async createPixChange(params: PixChargeRequest) {
    const userId = this._supabase.userUID;
    if (!userId) throw new Error('Usuário não autenticado');

    const payload = {
      order_id: params.order_id,
      amount: Math.round(params.amount * 100), // Converte R$ para centavos (ex: 312.40 -> 31240)
      description: params.description,
      user_id: userId,
      type: params.type
    };

    const { data, error } = await this._client.functions.invoke('create-openpix-charge', {
      body: payload
    });

    if (error) throw error;
    return data; // Retorna o brCode (Copiar e Cola) e a imagem do QR Code
  }
}
