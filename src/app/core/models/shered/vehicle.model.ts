export interface Vehicle {
  type: 'motorcycle' | 'car' | 'van' | 'truck';
  model: string;
  license_plate: string;
  capacity_volume: number; // em m³ ou quantidade de pacotes estimada
  status: 'active' | 'maintenance';
}