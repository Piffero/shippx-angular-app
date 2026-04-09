export interface UserProfile {
  id: string; // UUID do usuário, que deve ser igual ao ID do usuário no Supabase Auth
  organization_id: string;
  email: string;
  role: 'ADMIN' | 'CLIENT' | 'CARRIER';
  full_name: string;
  company_name?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Organizations {
  id: string
  name: string;
  created_at: string;
}