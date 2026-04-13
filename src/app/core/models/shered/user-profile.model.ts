export interface UserProfile {
  id: string; // UUID do usuário, que deve ser igual ao ID do usuário no Supabase Auth
  organization_id: string;
  email: string;
  full_name: string;
  role: UserRole;
  company_name: string;
  avatar_url: string;
  bio: string;
  website: string;
  phone: string;
  address_details: string;
  carrier_details: string;
  statistics: string;
  is_pro: boolean;
  created_at: string;
}

export interface Organizations {
  id: string
  name: string;
  created_at: string;
}

export type UserRole = "CLIENT" | "BROKER" | "CARRIER" | "ADMIN";