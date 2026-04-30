export interface Profile {
  id: string;
  organization_id: string | null;
  type_account: 'owner' | 'supplier' | 'trade' | 'carrier' | 'customer' | 'admin';
  full_name: string;
  document: string; // CNPJ ou CPF
  phone: string | null;
  address: string | null;
  city: string;
  state: string;
  role: 'owner' | 'director' | 'manager' | 'provider' | 'staff' | null;
  metadata: any;
  created_at?: string;
  updated_at?: string;
}