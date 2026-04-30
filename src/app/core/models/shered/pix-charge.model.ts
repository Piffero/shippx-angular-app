export interface PixChargeRequest {
  order_id?: string;
  amount: number;       // Valor em REAIS (o serviço converterá para centavos)
  description: string;
  type: 'order_payment' | 'subscription' | 'delivery_fee';
}