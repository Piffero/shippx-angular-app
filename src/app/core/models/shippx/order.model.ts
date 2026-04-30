export interface Order {
  id?: string;
  created_at?: string;
  updated_at?: string;
  bar_id: string;
  cervejaria_id: string;
  status: 'pendente' | 'confirmado' | 'nf_emitida' | 'aguardando_motorista' | 'em_andamento' | 'entregue' | 'cancelado';
  valor_total: number;
  frete_estimado?: number;
  endereco_entrega: string;
  cep_entrega?: string;
  observacoes?: string;
  nf_e_chave?: string;
  nf_e_numero?: string;
  nf_e_xml?: string;
  woovi_charge_id?: string;
  pago: boolean;
  pago_em?: string;
}

export interface OrderItem {
  id?: string;
  order_id: string;
  product_id: string;
  quantidade: number;
  preco_unitario: number;
  subtotal?: number; // Gerado automaticamente pelo banco
}