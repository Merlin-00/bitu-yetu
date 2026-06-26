import { CartItem } from './cart-item.model';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: ShippingAddress;
  status: 'Payée' | 'Expédiée' | 'Livrée';
  createdAt: any; // Firestore Timestamp
}
