import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  query,
  where,
} from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
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
      where('userId', '==', userId)
    );
    // return collectionData with idField option so we have the order IDs, sorted in client
    return (collectionData(q, { idField: 'id' }) as Observable<Order[]>).pipe(
      map(orders => {
        return orders.sort((a, b) => {
          const getMs = (dateVal: any): number => {
            if (!dateVal) return 0;
            if (typeof dateVal.toDate === 'function') {
              return dateVal.toDate().getTime();
            }
            if (dateVal.seconds !== undefined) {
              return dateVal.seconds * 1000;
            }
            return new Date(dateVal).getTime();
          };
          return getMs(b.createdAt) - getMs(a.createdAt);
        });
      })
    );
  }
}
