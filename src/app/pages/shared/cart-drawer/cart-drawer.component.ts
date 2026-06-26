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
              fill="#111111"
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
                fill="#888888"
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
                          fill="#991b1b"
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
            <button class="continue-btn" (click)="closeDrawer()">
              Continuer mes achats
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
      background: rgba(17, 17, 17, 0.4);
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
      background: var(--bg-main);
      border-left: 1px solid var(--border-light);
      z-index: 1001;
      display: flex;
      flex-direction: column;
      animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    .drawer-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        font-size: 1.15rem;
        font-weight: 800;
        color: var(--text-main);
        letter-spacing: -0.01em;
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
        background-color: var(--bg-sub);
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
      color: var(--text-muted);

      p {
        margin: 1rem 0 1.5rem;
        font-size: 1rem;
        font-weight: 500;
      }
    }

    .continue-shopping {
      background: var(--primary);
      color: var(--bg-main);
      border: 1px solid var(--primary);
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--primary-hover);
        border-color: var(--primary-hover);
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
      border-bottom: 1px solid var(--border-light);

      &:last-child {
        border-bottom: none;
      }
    }

    .item-img {
      width: 72px;
      height: 72px;
      object-fit: contain;
      background: white;
      border: 1px solid var(--border-light);
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
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-bottom: 4px;
    }

    .item-price {
      font-size: 0.9rem;
      color: var(--text-main);
      font-weight: 800;
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
      background: var(--bg-sub);
      border: 1px solid var(--border-light);
      padding: 2px;
    }

    .qty-btn {
      width: 24px;
      height: 24px;
      background: transparent;
      border: none;
      color: var(--text-main);
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;

      &:disabled {
        color: var(--text-muted);
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background: var(--accent-beige);
      }
    }

    .qty-val {
      min-width: 24px;
      text-align: center;
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-main);
    }

    .delete-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;

      &:hover {
        background-color: #fef2f2;
      }
    }

    .drawer-footer {
      padding: 1.5rem;
      border-top: 1px solid var(--border-light);
      background: var(--bg-sub);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.5rem;

      .total-price {
        font-size: 1.2rem;
        color: var(--text-main);
        font-weight: 800;
      }
    }

    .checkout-btn {
      background: var(--primary);
      color: var(--bg-main);
      border: 1px solid var(--primary);
      padding: 0.85rem;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--primary-hover);
        border-color: var(--primary-hover);
      }
    }

    .continue-btn {
      background: transparent;
      color: var(--text-main);
      border: 1px solid var(--border-light);
      padding: 0.8rem;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--accent-beige);
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
