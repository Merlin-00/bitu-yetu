import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  imports: [],
  template: `
    @if (cartService.isDrawerOpen()) {
      <div class="drawer-backdrop" (click)="closeDrawer()"></div>
      <div class="drawer-content">
        <header class="drawer-header">
          <h3>Votre Panier</h3>
          <button class="close-button" (click)="closeDrawer()">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#1e293b"
            >
              <path
                d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
              />
            </svg>
          </button>
        </header>

        <main class="drawer-body">
          @if (cartService.cartItems().length === 0) {
            <div class="empty-cart-state">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="64px"
                viewBox="0 -960 960 960"
                width="64px"
                fill="#cbd5e1"
              >
                <path
                  d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"
                />
              </svg>
              <p>Votre panier est vide</p>
              <button class="continue-shopping" (click)="closeDrawer()">
                Continuer mes achats
              </button>
            </div>
          } @else {
            <div class="cart-items-list">
              @for (item of cartService.cartItems(); track item.product.id) {
                <div class="cart-item">
                  <img
                    [src]="item.product.image"
                    [alt]="item.product.title"
                    class="item-img"
                  />
                  <div class="item-details">
                    <span class="item-title">{{ item.product.title }}</span>
                    <span class="item-price">$ {{ item.product.price }}</span>
                    <div class="item-actions">
                      <div class="quantity-picker">
                        <button
                          [disabled]="item.quantity === 1"
                          (click)="updateQty(item.product.id, item.quantity - 1)"
                          class="qty-btn"
                        >
                          -
                        </button>
                        <span class="qty-val">{{ item.quantity }}</span>
                        <button
                          [disabled]="item.quantity === 5"
                          (click)="updateQty(item.product.id, item.quantity + 1)"
                          class="qty-btn"
                        >
                          +
                        </button>
                      </div>
                      <button
                        (click)="removeItem(item.product.id)"
                        class="delete-btn"
                        title="Supprimer"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="20px"
                          viewBox="0 -960 960 960"
                          width="20px"
                          fill="#ef4444"
                        >
                          <path
                            d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </main>

        @if (cartService.cartItems().length > 0) {
          <footer class="drawer-footer">
            <div class="total-row">
              <span>Sous-total</span>
              <span class="total-price"
                >$ {{ cartService.totalAmount().toFixed(2) }}</span
              >
            </div>
            <button class="checkout-btn" (click)="goToCheckout()">
              Passer la commande
            </button>
          </footer>
        }
      </div>
    }
  `,
  styles: `
    .drawer-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 1000;
      animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .drawer-content {
      position: fixed;
      top: 0;
      right: 0;
      width: 100%;
      max-width: 440px;
      height: 100vh;
      background: #ffffff;
      box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
      z-index: 1001;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    .drawer-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        color: #1e293b;
      }
    }

    .close-button {
      border: none;
      background: transparent;
      cursor: pointer;
      padding: 6px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f1f5f9;
        transform: scale(1);
        opacity: 1;
      }
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem;
    }

    .empty-cart-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 70%;
      text-align: center;
      color: #64748b;

      p {
        margin: 1rem 0 1.5rem;
        font-size: 1.1rem;
        font-weight: 500;
      }
    }

    .continue-shopping {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
      transition: all 0.2s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 18px rgba(99, 102, 241, 0.35);
        opacity: 0.95;
      }
    }

    .cart-items-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .cart-item {
      display: flex;
      gap: 1rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #f8fafc;

      &:last-child {
        border-bottom: none;
      }
    }

    .item-img {
      width: 72px;
      height: 72px;
      object-fit: contain;
      background: white;
      border: 1px solid #f1f5f9;
      border-radius: 8px;
      padding: 6px;
      flex-shrink: 0;
    }

    .item-details {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-width: 0;
    }

    .item-title {
      font-size: 0.9rem;
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 2px;
    }

    .item-price {
      font-size: 0.95rem;
      color: #4f46e5;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .item-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .quantity-picker {
      display: flex;
      align-items: center;
      background: #f1f5f9;
      border-radius: 8px;
      padding: 2px;
    }

    .qty-btn {
      width: 26px;
      height: 26px;
      background: transparent;
      border: none;
      color: #1e293b;
      font-weight: 600;
      font-size: 1rem;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      &:disabled {
        color: #94a3b8;
        cursor: not-allowed;
        background: transparent;
      }

      &:hover:not(:disabled) {
        background: #e2e8f0;
        opacity: 1;
        scale: 1;
      }
    }

    .qty-val {
      min-width: 24px;
      text-align: center;
      font-size: 0.85rem;
      font-weight: 700;
      color: #1e293b;
    }

    .delete-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;

      &:hover {
        background-color: #fef2f2;
        opacity: 1;
        scale: 1;
      }
    }

    .drawer-footer {
      padding: 1.5rem;
      border-top: 1px solid #f1f5f9;
      background: #f8fafc;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: #64748b;

      .total-price {
        font-size: 1.25rem;
        color: #0f172a;
        font-weight: 800;
      }
    }

    .checkout-btn {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 12px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
      transition: all 0.25s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        opacity: 0.95;
      }
    }
  `,
})
export class CartDrawerComponent {
  cartService = inject(CartService);
  private router = inject(Router);

  closeDrawer() {
    this.cartService.isDrawerOpen.set(false);
  }

  updateQty(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  goToCheckout() {
    this.closeDrawer();
    this.router.navigate(['/checkout']);
  }
}
