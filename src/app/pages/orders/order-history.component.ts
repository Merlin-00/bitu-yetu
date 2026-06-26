import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order } from '../../core/models/order.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-history',
  imports: [],
  template: `
    <main class="orders-page max-width">
      <header class="page-header">
        <h2>Vos Commandes</h2>
        <p class="subtitle">Consultez l'historique et l'état de vos commandes passées</p>
      </header>

      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <span>Chargement de votre historique...</span>
        </div>
      } @else if (orders().length === 0) {
        <div class="empty-orders">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="80px"
            viewBox="0 -960 960 960"
            width="80px"
            fill="#cbd5e1"
          >
            <path
              d="m384-336 240-240-57-56-183 183-87-87-57 56 144 144Zm96 256q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
            />
          </svg>
          <h3>Aucune commande trouvée</h3>
          <p>Vous n'avez pas encore passé de commande sur notre boutique.</p>
          <button class="shop-btn" (click)="goToHome()">Parcourir la boutique</button>
        </div>
      } @else {
        <div class="orders-list">
          @for (order of orders(); track order.id) {
            <div class="order-card" [class.expanded]="expandedOrderId() === order.id">
              <!-- Card Header Summary -->
              <div class="order-header" (click)="toggleExpand(order.id!)">
                <div class="header-main-info">
                  <span class="order-ref">Réf: {{ order.id?.substring(0, 10) }}...</span>
                  <span class="order-date">{{ formatDate(order.createdAt) }}</span>
                </div>
                <div class="header-sub-info">
                  <span class="order-total">$ {{ order.totalAmount.toFixed(2) }}</span>
                  <span class="order-badge" [class.paid]="order.status === 'Payée'">
                    {{ order.status }}
                  </span>
                  <svg
                    class="chevron-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#64748b"
                  >
                    <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                  </svg>
                </div>
              </div>

              <!-- Expanded Details -->
              @if (expandedOrderId() === order.id) {
                <div class="order-details-body">
                  <div class="details-grid">
                    <!-- Items Purchased -->
                    <div class="purchased-items">
                      <h5>Articles commandés</h5>
                      <div class="items-list">
                        @for (item of order.items; track item.product.id) {
                          <div class="product-row">
                            <img [src]="item.product.image" [alt]="item.product.title" class="prod-img" />
                            <div class="prod-info">
                              <span class="prod-title">{{ item.product.title }}</span>
                              <span class="prod-price">
                                $ {{ item.product.price }} x {{ item.quantity }}
                              </span>
                            </div>
                            <span class="prod-total">
                              $ {{ (item.product.price * item.quantity).toFixed(2) }}
                            </span>
                          </div>
                        }
                      </div>
                    </div>

                    <!-- Shipping Address Info -->
                    <div class="shipping-info">
                      <h5>Adresse de livraison</h5>
                      <div class="address-box">
                        <p class="name">{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</p>
                        <p>{{ order.shippingAddress.address }}</p>
                        <p>{{ order.shippingAddress.zipCode }} {{ order.shippingAddress.city }}</p>
                        <p class="phone">📞 {{ order.shippingAddress.phone }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </main>
  `,
  styles: `
    .orders-page {
      padding: 2.5rem 1rem;
      min-height: calc(100vh - 120px);
    }

    .page-header {
      margin-bottom: 2.5rem;
      h2 {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 800;
        color: #0f172a;
      }
      .subtitle {
        margin: 0.4rem 0 0;
        color: #64748b;
        font-size: 0.95rem;
      }
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 5rem 0;
      color: #64748b;
    }

    .spinner {
      width: 28px;
      height: 28px;
      border: 3px solid #e2e8f0;
      border-top-color: #4f46e5;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-orders {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 5rem 1rem;
      color: #64748b;

      h3 {
        margin: 1.5rem 0 0.5rem;
        color: #0f172a;
        font-size: 1.3rem;
        font-weight: 700;
      }

      p {
        margin-bottom: 2rem;
      }
    }

    .shop-btn {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }

    /* Orders List & Cards */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .order-card {
      background: #ffffff;
      border: 1px solid rgba(226, 232, 240, 0.8);
      border-radius: 16px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.01);
      overflow: hidden;
      transition: all 0.25s;

      &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
      }

      &.expanded {
        border-color: #4f46e5;
        box-shadow: 0 8px 30px rgba(99, 102, 241, 0.06);

        .chevron-icon {
          transform: rotate(180deg);
          fill: #4f46e5;
        }
      }
    }

    .order-header {
      padding: 1.25rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      user-select: none;
      flex-wrap: wrap;
      gap: 12px;
    }

    .header-main-info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .order-ref {
        font-size: 0.95rem;
        font-weight: 700;
        color: #0f172a;
      }

      .order-date {
        font-size: 0.8rem;
        color: #64748b;
      }
    }

    .header-sub-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;

      .order-total {
        font-size: 1.1rem;
        font-weight: 800;
        color: #4f46e5;
      }

      .order-badge {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 4px 10px;
        border-radius: 50px;
        text-transform: uppercase;

        &.paid {
          background: rgba(34, 197, 94, 0.1);
          color: #166534;
        }
      }

      .chevron-icon {
        transition: transform 0.2s ease-in-out;
      }
    }

    /* Details body */
    .order-details-body {
      padding: 1.5rem;
      background: #f8fafc;
      border-top: 1px solid #f1f5f9;
      animation: expandIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes expandIn {
      from {
        opacity: 0;
        transform: translateY(-5px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .details-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;

      @media (min-width: 768px) {
        grid-template-columns: 1.5fr 1fr;
      }
    }

    .purchased-items {
      display: flex;
      flex-direction: column;

      h5 {
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
        font-weight: 700;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .product-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e2e8f0;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .prod-img {
        width: 38px;
        height: 38px;
        object-fit: contain;
        background: white;
        border-radius: 4px;
        padding: 2px;
        border: 1px solid #e2e8f0;
        flex-shrink: 0;
      }

      .prod-info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-width: 0;

        .prod-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: #334155;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .prod-price {
          font-size: 0.75rem;
          color: #64748b;
        }
      }

      .prod-total {
        font-size: 0.85rem;
        font-weight: 700;
        color: #0f172a;
      }
    }

    .shipping-info {
      display: flex;
      flex-direction: column;

      h5 {
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
        font-weight: 700;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }

    .address-box {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      font-size: 0.85rem;
      color: #475569;
      line-height: 1.5;

      p {
        margin: 0 0 4px;
        &:last-child {
          margin-bottom: 0;
        }
      }

      .name {
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 6px;
      }

      .phone {
        margin-top: 6px;
        font-weight: 500;
      }
    }
  `,
})
export default class OrderHistoryComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  expandedOrderId = signal<string | null>(null);

  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ordersSub?: Subscription;

  ngOnInit() {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/auth'], {
        queryParams: { returnUrl: '/orders' },
      });
      return;
    }

    this.ordersSub = this.orderService.getUserOrders(user.uid).subscribe({
      next: (ordersList) => {
        this.orders.set(ordersList);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  toggleExpand(orderId: string) {
    if (this.expandedOrderId() === orderId) {
      this.expandedOrderId.set(null);
    } else {
      this.expandedOrderId.set(orderId);
    }
  }

  formatDate(createdAt: any): string {
    if (!createdAt) return '';
    const date = typeof createdAt.toDate === 'function' ? createdAt.toDate() : new Date(createdAt);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.ordersSub?.unsubscribe();
  }
}
