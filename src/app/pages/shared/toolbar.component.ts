import { Component, inject, signal } from '@angular/core';
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
            <span class="logo-icon">🚀</span>
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
                fill="#1e293b"
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
              <div class="user-menu-container" (click)="toggleUserMenu()">
                <div class="user-avatar">
                  {{ getUserInitials() }}
                </div>
                
                @if (isUserMenuOpen()) {
                  <div class="user-dropdown">
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
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 0.5rem 1rem;
      border-bottom: 1px solid rgba(228, 228, 228, 0.6);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.03);
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
          font-size: 1.5rem;
        }

        h2 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #4f46e5 0%, #a855f7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
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
      gap: 1.5rem;
    }

    .cart-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 12px;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f1f5f9;
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
        background: #ef4444;
        color: white;
        font-size: 0.7rem;
        font-weight: 800;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      }

      .cart-label {
        font-size: 0.9rem;
        font-weight: 600;
        color: #1e293b;
      }
    }

    .auth-section {
      display: flex;
      align-items: center;
    }

    .auth-skeleton {
      width: 38px;
      height: 38px;
      background: #f1f5f9;
      border-radius: 50%;
      animation: pulse 1.5s infinite ease-in-out;
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }

    .login-button {
      background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
      color: white !important;
      padding: 8px 18px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      box-shadow: 0 4px 10px rgba(99, 102, 241, 0.2);
      transition: all 0.2s;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 6px 15px rgba(99, 102, 241, 0.3);
        opacity: 0.95;
      }
    }

    .user-menu-container {
      position: relative;
      cursor: pointer;
    }

    .user-avatar {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #4f46e5 0%, #a855f7 100%);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.95rem;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.2);
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.05);
      }
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      background: white;
      border: 1px solid #f1f5f9;
      border-radius: 14px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
      width: 220px;
      z-index: 1000;
      padding: 6px;
      animation: dropdownSlide 0.2s cubic-bezier(0.16, 1, 0.3, 1);

      hr {
        border: none;
        border-top: 1px solid #f1f5f9;
        margin: 4px 0;
      }
    }

    @keyframes dropdownSlide {
      from {
        opacity: 0;
        transform: translateY(8px);
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
        color: #64748b;
        word-break: break-all;
      }
    }

    .dropdown-item {
      display: block;
      padding: 10px 12px;
      color: #334155;
      font-size: 0.85rem;
      font-weight: 500;
      border-radius: 8px;
      transition: background-color 0.2s;
      width: 100%;
      text-align: left;
      border: none;
      background: transparent;
      cursor: pointer;

      &:hover {
        background-color: #f1f5f9;
      }
    }

    .logout-btn {
      color: #ef4444;

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

  openCart() {
    this.cartService.isDrawerOpen.set(true);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update((val) => !val);
  }

  closeUserMenu() {
    this.isUserMenuOpen.set(false);
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
