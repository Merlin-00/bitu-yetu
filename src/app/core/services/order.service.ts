import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  orderBy,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private firestore = inject(Firestore);

  createOrder(order: Order) {
    const ordersCol = collection(this.firestore, 'orders');
    return addDoc(ordersCol, {
      ...order,
      createdAt: new Date(), // use JS date which Firestore SDK converts to Timestamp
    });
  }

  getUserOrders(userId: string): Observable<Order[]> {
    const ordersCol = collection(this.firestore, 'orders');
    const q = query(
      ordersCol,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    // return collectionData with idField option so we have the order IDs
    return collectionData(q, { idField: 'id' }) as Observable<Order[]>;
  }
}
