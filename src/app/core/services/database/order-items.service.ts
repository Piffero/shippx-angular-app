import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { OrderItem } from '../../models/shippx/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderItemsService {
  private readonly TABLE = 'order_items';
  private _client = inject(SupabaseService).client;

  // Insere múltiplos itens de uma vez (Bulk Insert)
  async addItemsToOrder(items: OrderItem[]): Promise<void> {
    const { error } = await this._client
      .from(this.TABLE)
      .insert(items);

    if (error) throw new Error(`Erro ao inserir itens: ${error.message}`);
  }

  // Busca itens de um pedido específico com dados do produto
  async getItemsByOrder(orderId: string) {
    const { data, error } = await this._client
      .from(this.TABLE)
      .select(`
        *,
        products (nome, foto_url, unidade)
      `)
      .eq('order_id', orderId);

    if (error) throw error;
    return data;
  }

  // Deleta um item específico do pedido (ex: remover do carrinho)
  async deleteItem(itemId: string): Promise<void> {
    const { error } = await this._client
      .from(this.TABLE)
      .delete()
      .eq('id', itemId);

    if (error) {
      console.error('Erro ao deletar item do pedido:', error);
      throw new Error('Não foi possível remover o item.');
    }
  }

  // Útil para quando o usuário limpa o carrinho inteiro ou cancela o rascunho
  async deleteAllItemsFromOrder(orderId: string): Promise<void> {
    const { error } = await this._client
      .from(this.TABLE)
      .delete()
      .eq('order_id', orderId);

    if (error) {
      console.error('Erro ao limpar itens do pedido:', error);
      throw new Error('Não foi possível limpar os itens do pedido.');
    }
  }

}
