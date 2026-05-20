import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { Order } from '../../models/shippx/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly TABLE = 'orders';
  private _client = inject(SupabaseService).client;

  // Cria o pedido inicial e retorna o ID para os itens
  async createOrder(order: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const { data, error } = await this._client
      .from(this.TABLE)
      .insert(order)
      .select()
      .single();

    if (error) throw new Error(`Erro ao criar pedido: ${error.message}`);
    return data as Order;
  }

  async getOrderById(orderId: string): Promise<Order> {
    const { data, error } = await this._client
      .from(this.TABLE)
      .select('*')
      .eq('id', orderId)
      .single();

    if (error) throw new Error(`Erro ao buscar pedido: ${error.message}`);
    return data as Order;
  }

  // Lista pedidos por Bar ou Cervejaria (Multitenant)
  async listMyOrders(role: 'bar_id' | 'cervejaria_id', id: string): Promise<Order[]> {
    const { data, error } = await this._client
      .from(this.TABLE)
      .select('*')
      .eq(role, id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  }

  // Lista pedidos por status (ex: para motoristas verem oportunidades)
  async listOrdersByStatus(status: Order['status']): Promise<Order[]> {
    const { data, error } = await this._client
      .from(this.TABLE)
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as Order[];
  }

  async listMyPurchasesByStatus(statuses: Order['status'][]): Promise<Order[]> {
    const { data, error } = await this._client
      .from(this.TABLE)
      .select('*')
      .eq('bar_id', inject(SupabaseService).userUID)
      .in('status', statuses)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Order[];
  }

  // Atualiza status (ex: Confirmar recebimento do PIX ou emissão de NF)
  async updateOrderStatus(orderId: string, status: Order['status'], additionalData?: Partial<Order>) {
    const { data, error } = await this._client
      .from(this.TABLE)
      .update({ status, ...additionalData })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateOrderNfe(orderId: string, nfeData: Partial<Order>) {
    const { data, error } = await this._client
      .from(this.TABLE)
      .update(nfeData)
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
