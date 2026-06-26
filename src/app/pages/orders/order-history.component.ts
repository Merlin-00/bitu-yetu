import { Component, inject, OnInit, signal, effect, computed } from '@angular/core';
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
            fill="var(--text-muted)"
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
          @for (order of paginatedOrders(); track order.id) {
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
                    fill="var(--text-main)"
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

        <!-- Pagination Controls -->
        @if (totalPages() > 1) {
          <div class="pagination-controls">
            <button 
              class="pag-btn" 
              [disabled]="currentPage() === 1" 
              (click)="prevPage()"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>
              </svg>
              Précédent
            </button>
            
            <span class="page-info">
              Page {{ currentPage() }} sur {{ totalPages() }}
            </span>
            
            <button 
              class="pag-btn" 
              [disabled]="currentPage() === totalPages()" 
              (click)="nextPage()"
            >
              Suivant
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor">
                <path d="M379-244 323-300l180-180-180-180 56-56 236 236-236 236Z"/>
              </svg>
            </button>
          </div>
        }
      }
    </main>
  `,
  styles: `
    .orders-page {
      padding: 3rem 1rem;
      min-height: calc(100vh - 120px);
    }

    .page-header {
      margin-bottom: 3rem;
      h2 {
        margin: 0;
        font-size: 1.8rem;
        font-weight: 700;
        color: var(--text-main);
        letter-spacing: 0.05em;
      }
      .subtitle {
        margin: 0.5rem 0 0;
        color: var(--text-muted);
        font-size: 0.95rem;
      }
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      padding: 6rem 0;
      color: var(--text-muted);
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 2px solid var(--border-light);
      border-top-color: var(--primary);
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
      padding: 6rem 1rem;
      color: var(--text-muted);
      border: 1px solid var(--border-light);
      background: var(--bg-sub);

      h3 {
        margin: 1.5rem 0 0.5rem;
        color: var(--text-main);
        font-size: 1.4rem;
        font-weight: 700;
      }

      p {
        margin-bottom: 2rem;
        font-size: 0.95rem;
      }
    }

    .shop-btn {
      background: var(--primary);
      color: white;
      border: 1px solid var(--primary);
      padding: 0.75rem 2rem;
      font-weight: 600;
      cursor: pointer;
      font-size: 0.85rem;
      letter-spacing: 0.05em;

      &:hover {
        background: var(--primary-hover);
      }
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-light);
    }

    .pag-btn {
      background: var(--bg-sub);
      color: var(--text-main);
      border: 1px solid var(--border-light);
      padding: 0.5rem 1.25rem;
      font-size: 0.8rem;
      font-weight: 600;
      letter-spacing: 0.02em;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;

      &:hover:not(:disabled) {
        background: var(--primary);
        color: var(--bg-main);
        border-color: var(--primary);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .page-info {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-muted);
    }

    /* Orders List & Cards */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .order-card {
      background: var(--bg-sub);
      border: 1px solid var(--border-light);
      border-radius: 0px;
      overflow: hidden;
      transition: all 0.2s ease-in-out;

      &:hover {
        border-color: var(--primary);
      }

      &.expanded {
        border-color: var(--primary);

        .chevron-icon {
          transform: rotate(180deg);
        }
      }
    }

    .order-header {
      padding: 1.5rem 2rem;
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
      gap: 4px;

      .order-ref {
        font-size: 1rem;
        font-weight: 700;
        color: var(--text-main);
        letter-spacing: 0.02em;
      }

      .order-date {
        font-size: 0.8rem;
        color: var(--text-muted);
      }
    }

    .header-sub-info {
      display: flex;
      align-items: center;
      gap: 2rem;

      .order-total {
        font-size: 1.1rem;
        font-weight: 800;
        color: var(--text-main);
      }

      .order-badge {
        font-size: 0.75rem;
        font-weight: 700;
        padding: 4px 12px;
        letter-spacing: 0.05em;
        background: var(--primary);
        color: white;

        &.paid {
          background: var(--primary);
          color: white;
        }
      }

      .chevron-icon {
        transition: transform 0.25s ease-in-out;
      }
    }

    /* Details body */
    .order-details-body {
      padding: 2rem;
      background: var(--bg-main);
      border-top: 1px solid var(--border-light);
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
      gap: 2.5rem;

      @media (min-width: 768px) {
        grid-template-columns: 1.4fr 1fr;
      }
    }

    .purchased-items {
      display: flex;
      flex-direction: column;

      h5 {
        margin: 0 0 1.25rem 0;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-main);
        letter-spacing: 0.05em;
      }
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .product-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-light);

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .prod-img {
        width: 44px;
        height: 44px;
        object-fit: contain;
        background: white;
        padding: 4px;
        border: 1px solid var(--border-light);
        flex-shrink: 0;
      }

      .prod-info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-width: 0;

        .prod-title {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .prod-price {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      }

      .prod-total {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--text-main);
      }
    }

    .shipping-info {
      display: flex;
      flex-direction: column;

      h5 {
        margin: 0 0 1.25rem 0;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-main);
        letter-spacing: 0.05em;
      }
    }

    .address-box {
      background: white;
      border: 1px solid var(--border-light);
      padding: 1.25rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.6;

      p {
        margin: 0 0 6px;
        &:last-child {
          margin-bottom: 0;
        }
      }

      .name {
        font-weight: 700;
        color: var(--text-main);
        margin-bottom: 8px;
        font-size: 0.8rem;
        letter-spacing: 0.02em;
      }

      .phone {
        margin-top: 8px;
        font-weight: 500;
        color: var(--text-main);
      }
    }
  `,
})
export default class OrderHistoryComponent implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  expandedOrderId = signal<string | null>(null);

  currentPage = signal(1);
  pageSize = 5;

  paginatedOrders = computed(() => {
    const allOrders = this.orders();
    const startIndex = (this.currentPage() - 1) * this.pageSize;
    return allOrders.slice(startIndex, startIndex + this.pageSize);
  });

  totalPages = computed(() => {
    return Math.ceil(this.orders().length / this.pageSize) || 1;
  });

  private orderService = inject(OrderService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private ordersSub?: Subscription;

  constructor() {
    effect(() => {
      const loading = this.authService.loading();
      const user = this.authService.currentUser();
      if (!loading) {
        if (!user) {
          this.router.navigate(['/auth'], {
            queryParams: { returnUrl: '/orders' },
          });
        } else {
          // start subscribing to orders if not already subscribed
          if (!this.ordersSub) {
            this.subscribeToOrders(user.uid);
          }
        }
      }
    });
  }

  ngOnInit() {
    // Left empty since active auth check and loading is reactive in effect() inside constructor
  }

  subscribeToOrders(userId: string) {
    this.ordersSub = this.orderService.getUserOrders(userId).subscribe({
      next: (ordersList) => {
        this.orders.set(ordersList);
        this.currentPage.set(1); // Reset page to 1
        this.loading.set(false);
      },
      error: (err) => {
        console.error("Erreur de chargement de l'historique des commandes:", err);
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

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.ordersSub?.unsubscribe();
  }
}
