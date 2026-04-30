export interface Product {
  id?: string;
  created_at?: string;
  updated_at?: string;
  cervejaria_id: string;
  nome: string;
  descricao: string | null;
  preco_unitario: number;
  unidade: string;
  foto_url: string | null;
  estoque_aproximado: number;
  ativo: boolean;
}