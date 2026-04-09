export interface Shipment {
  id: string;
  title: string;
  category_id: string;
  subcategory_id: string;
  shippx_details: ShipmentDetails;
  sender_details: ShippingDetails;
  sender: ShipmentParty;
  reciever: ShipmentParty;
  status: 'DRAFT' | 'PUBLISHED' | 'IN_TRANSIT' | 'DELIVERED';
}

export interface ShipmentDetails {
  items_count: number;
  description?: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  PickupLocation: ShipmentLocation;
  DeliveryLocation: ShipmentLocation;
  is_palletized: boolean;
  is_stackable: boolean;
  is_crated: boolean;
}

export interface ShippingDetails {
  pickup_date: string; // ISO date string
  delivery_date: string; // ISO date string
  transport_type: 'OPEN' | 'ENCLOSED' | 'REEFER';
  image_base64?: string; // optional base64-encoded image string
  special_instructions?: string;
  reference_type?: 'VIN' | 'INVOICE' | 'SALES_ORDER' | 'OTHER' | 'LOT' | 'RELEASE' | 'THIRD_PARTY_TRACKING' | 'ORDER_NUMBER';
  reference_code?: string;

}

export interface ShipmentLocation {
  address: string;
  addressType: string; // e.g., 'RESIDENTIAL', 'COMMERCIAL'
  city: string;
  state: string;
  postal_code: string;
  country: string;
  
}

export interface ShipmentParty {
  name: string;
  contact_number: string;
  email: string;
  company_name?: string;
}

export interface ShipmentCategory {
  id: string;
  name: string;
  description?: string;
  icon_url?: string;
}

export interface ShipmentSubcategory {
  id: string;
  category_id: string;
  name: string;
  description?: string;
  icon_url?: string;
}

export const SHIPMENT_CATEGORIES_MOCK: ShipmentCategory[] = [];

export const SHIPMENT_SUBCATEGORIES_MOCK: ShipmentSubcategory[] = [];
