import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { CartDrawerComponent } from './cart-drawer/cart-drawer.component';

@Component({
  selector: 'app-toolbar',
  imports: [RouterLink, SearchBarComponent, CartDrawerComponent],
  template: `
    <header class="toolbar-container">
      <div class="toolbar max-width">
        <div class="logo-side">
          <a routerLink="/" class="logo-link">
            <span class="logo-icon">🛒</span>
            <h2>bitu-yetu</h2>
          </a>
        </div>

        <div class="search-side">
          <app-search-bar />
        </div>

        <div class="actions-side">
          <!-- Cart Icon -->
          <div class="cart-container" (click)="openCart()">
            <div class="cart-icon-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#111111"
              >
                <path
                  d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"
                />
              </svg>
              @if (cartService.cartCount() > 0) {
                <span class="cart-badge">{{ cartService.cartCount() }}</span>
              }
            </div>
            <span class="cart-label">Panier</span>
          </div>

          <!-- Auth Status -->
          <div class="auth-section">
            @if (authService.loading()) {
              <div class="auth-skeleton"></div>
            } @else if (authService.currentUser()) {
              <div class="user-menu-container" (click)="toggleUserMenu($event)">
                <div class="user-avatar" [class.has-img]="authService.currentUser()?.photoURL">
                  @if (authService.currentUser()?.photoURL) {
                    <img [src]="authService.currentUser()?.photoURL" alt="avatar" class="avatar-img" />
                  } @else {
                    {{ getUserInitials() }}
                  }
                </div>
                
                @if (isUserMenuOpen()) {
                  <div class="user-dropdown" (click)="preventClose($event)">
                    <div class="dropdown-header">
                      <span class="user-email">{{ authService.currentUser()?.email }}</span>
                    </div>
                    <hr />
                    <a routerLink="/orders" class="dropdown-item" (click)="closeUserMenu()">
                      📦 Mes commandes
                    </a>
                    <hr />
                    <button class="dropdown-item logout-btn" (click)="logout()">
                      🚪 Déconnexion
                    </button>
                  </div>
                }
              </div>
            } @else {
              <a routerLink="/auth" class="login-button">Connexion</a>
            }
          </div>
        </div>
      </div>
    </header>

    <!-- Global Cart Drawer Drawer -->
    <app-cart-drawer />
  `,
  styles: `
    .toolbar-container {
      position: sticky;
      top: 0;
      z-index: 999;
      background: var(--bg-main);
      border-bottom: 1px solid var(--border-light);
      padding: 0.5rem 1rem;
    }

    .toolbar {
      height: 56px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
    }

    .logo-side {
      display: flex;
      align-items: center;

      .logo-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        
        .logo-icon {
          font-size: 1.3rem;
        }

        h2 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          letter-spacing: -0.03em;
        }
      }
    }

    .search-side {
      flex: 1;
      max-width: 500px;
      display: flex;
      justify-content: center;
    }

    .actions-side {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .cart-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 6px 12px;
      border: 1px solid transparent;
      transition: all 0.2s;

      &:hover {
        background-color: var(--bg-sub);
        border-color: var(--border-light);
      }

      .cart-icon-wrapper {
        position: relative;
        display: flex;
        align-items: center;
      }

      .cart-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: var(--text-main);
        color: var(--bg-main);
        font-size: 0.65rem;
        font-weight: 800;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--bg-main);
      }

      .cart-label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-main);
      }
    }

    .auth-section {
      display: flex;
      align-items: center;
    }

    .auth-skeleton {
      width: 36px;
      height: 36px;
      background: var(--bg-sub);
      border-radius: 50%;
      border: 1px solid var(--border-light);
      animation: pulse 1.5s infinite ease-in-out;
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }

    .login-button {
      background: var(--primary);
      color: var(--bg-main) !important;
      padding: 8px 16px;
      font-weight: 600;
      font-size: 0.85rem;
      border: 1px solid var(--primary);
      transition: all 0.2s;

      &:hover {
        background: var(--primary-hover);
        border-color: var(--primary-hover);
      }
    }

    .user-menu-container {
      position: relative;
      cursor: pointer;
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: var(--primary);
      color: var(--bg-main);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.85rem;
      border: 1px solid var(--primary);
      overflow: hidden;

      &.has-img {
        background: transparent;
        border-color: var(--border-light);
      }

      .avatar-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      background: var(--bg-main);
      border: 1px solid var(--border-light);
      width: 220px;
      z-index: 1000;
      padding: 6px;
      animation: dropdownSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      hr {
        border: none;
        border-top: 1px solid var(--border-light);
        margin: 4px 0;
      }
    }

    @keyframes dropdownSlide {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-header {
      padding: 8px 12px;
      display: flex;
      flex-direction: column;

      .user-email {
        font-size: 0.8rem;
        color: var(--text-muted);
        word-break: break-all;
      }
    }

    .dropdown-item {
      display: block;
      padding: 8px 12px;
      color: var(--text-main);
      font-size: 0.85rem;
      font-weight: 500;
      transition: background-color 0.2s;
      width: 100%;
      text-align: left;
      border: none;
      background: transparent;
      cursor: pointer;

      &:hover {
        background-color: var(--bg-sub);
      }
    }

    .logout-btn {
      color: #991b1b;

      &:hover {
        background-color: #fef2f2;
      }
    }
  `,
})
export class ToolbarComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);
  isUserMenuOpen = signal(false);
  
  private elementRef = inject(ElementRef);

  openCart() {
    this.cartService.isDrawerOpen.set(true);
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.isUserMenuOpen.update((val) => !val);
  }

  closeUserMenu() {
    this.isUserMenuOpen.set(false);
  }

  preventClose(event: Event) {
    event.stopPropagation();
  }

  @HostListener('document:click')
  onDocumentClick() {
    this.closeUserMenu();
  }

  logout() {
    this.closeUserMenu();
    this.authService.logout();
  }

  getUserInitials(): string {
    const email = this.authService.currentUser()?.email || '';
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  }
}

