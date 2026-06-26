import { isPlatformBrowser } from '@angular/common';
import { computed, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private platformId = inject(PLATFORM_ID);
  
  cartItems = signal<CartItem[]>(this.loadCartFromStorage());
  isDrawerOpen = signal<boolean>(false);

  cartCount = computed(() =>
    this.cartItems().reduce((count, item) => count + item.quantity, 0)
  );

  totalAmount = computed(() =>
    this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  private loadCartFromStorage(): CartItem[] {
    if (isPlatformBrowser(this.platformId)) {
      const stored = localStorage.getItem('bitu_yetu_cart');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  }

  private saveCartToStorage(items: CartItem[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('bitu_yetu_cart', JSON.stringify(items));
    }
  }

  addToCart(product: Product, quantity: number = 1) {
    this.cartItems.update((items) => {
      const existing = items.find((item) => item.product.id === product.id);
      let newItems: CartItem[];
      if (existing) {
        newItems = items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, 5) }
            : item
        );
      } else {
        newItems = [...items, { product, quantity }];
      }
      this.saveCartToStorage(newItems);
      return newItems;
    });
    this.isDrawerOpen.set(true);
  }

  removeFromCart(productId: number) {
    this.cartItems.update((items) => {
      const newItems = items.filter((item) => item.product.id !== productId);
      this.saveCartToStorage(newItems);
      return newItems;
    });
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartItems.update((items) => {
      const newItems = items.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, 5)) }
          : item
      );
      this.saveCartToStorage(newItems);
      return newItems;
    });
  }

  clearCart() {
    this.cartItems.set([]);
    this.saveCartToStorage([]);
  }
}
