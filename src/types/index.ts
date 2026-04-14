export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  unit: string; // e.g., "kg", "karung"
  imageUrl?: string;
  image?: string; // Base64 string for uploaded image
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  timestamp: number;
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'transfer' | 'qris';
  customerName?: string;
}

export type View = 'dashboard' | 'products' | 'pos' | 'history';
