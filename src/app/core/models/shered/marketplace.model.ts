export interface Marketplace {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  status: 'active' | 'expired' | 'none';
}