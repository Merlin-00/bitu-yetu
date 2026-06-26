import { Component, inject, signal, effect } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  imports: [FormsModule],
  template: `
    <main class="auth-page max-width">
      <div class="auth-card">
        <div class="card-header">
          <h2>{{ isLoginTab() ? 'Bon retour !' : 'Créer un compte' }}</h2>
          <p class="subtitle">
            {{ isLoginTab() ? 'Connectez-vous pour finaliser vos achats' : 'Rejoignez bitu-yetu aujourd\\'hui' }}
          </p>
          <div class="tab-switcher">
            <button
              [class.active]="isLoginTab()"
              (click)="setTab(true)"
              class="tab-btn"
            >
              Connexion
            </button>
            <button
              [class.active]="!isLoginTab()"
              (click)="setTab(false)"
              class="tab-btn"
            >
              Inscription
            </button>
          </div>
        </div>

        <form (submit)="onSubmit($event)" class="auth-form">
          @if (errorMessage()) {
            <div class="error-banner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#b91c1c"
              >
                <path
                  d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
                />
              </svg>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <div class="form-group">
            <label for="email">Adresse E-mail</label>
            <div class="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="email"
                required
                placeholder="vous@exemple.com"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Mot de passe</label>
            <div class="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="password"
                required
                placeholder="••••••••"
                class="form-input"
              />
            </div>
          </div>

          @if (!isLoginTab()) {
            <div class="form-group">
              <label for="confirmPassword">Confirmer le mot de passe</label>
              <div class="input-wrapper">
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  required
                  placeholder="••••••••"
                  class="form-input"
                />
              </div>
            </div>
          }

          <button
            type="submit"
            [disabled]="authLoading()"
            class="submit-button"
          >
            @if (authLoading()) {
              <div class="spinner"></div>
              <span>Traitement...</span>
            } @else {
              <span>{{ isLoginTab() ? 'Se connecter' : 'Créer mon compte' }}</span>
            }
          </button>
        </form>

        <div class="divider">
          <span>OU</span>
        </div>

        <button
          (click)="loginWithGoogle()"
          [disabled]="authLoading()"
          class="google-button"
        >
          <svg class="google-icon" viewBox="0 0 24 24" width="18px" height="18px">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continuer avec Google</span>
        </button>
      </div>
    </main>
  `,
  styles: `
    .auth-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 120px);
      padding: 2rem 1rem;
    }

    .auth-card {
      background: var(--bg-main);
      border: 1px solid var(--border-light);
      width: 100%;
      max-width: 420px;
      padding: 2.5rem;
      box-sizing: border-box;
      animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .card-header {
      text-align: center;
      margin-bottom: 2rem;

      h2 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 800;
        color: var(--text-main);
        letter-spacing: -0.01em;
      }

      .subtitle {
        margin: 0.5rem 0 1.5rem;
        font-size: 0.85rem;
        color: var(--text-muted);
      }
    }

    .tab-switcher {
      display: flex;
      background: var(--bg-sub);
      border: 1px solid var(--border-light);
      padding: 4px;
    }

    .tab-btn {
      flex: 1;
      border: none;
      background: transparent;
      padding: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: var(--bg-main);
        color: var(--text-main);
        border: 1px solid var(--border-light);
      }

      &:hover:not(.active) {
        color: var(--text-main);
      }
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .error-banner {
      background: #fef2f2;
      border: 1px solid #fee2e2;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      color: #991b1b;
      font-size: 0.8rem;
      font-weight: 500;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        color: var(--text-muted);
      }
    }

    .form-input {
      width: 100%;
      height: 42px;
      padding: 0 12px;
      border: 1px solid var(--border-light);
      background: var(--bg-main);
      color: var(--text-main);
      font-size: 0.85rem;
      outline: none;
      box-sizing: border-box;
      transition: all 0.2s;
      font-family: inherit;

      &:focus {
        border-color: var(--primary);
      }
    }

    .submit-button {
      background: var(--primary);
      color: var(--bg-main);
      border: 1px solid var(--primary);
      height: 44px;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.25s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-top: 0.5rem;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &:hover:not(:disabled) {
        background: var(--primary-hover);
        border-color: var(--primary-hover);
      }
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .divider {
      display: flex;
      align-items: center;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.7rem;
      font-weight: 700;
      margin: 1.25rem 0;

      &::before,
      &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid var(--border-light);
      }

      span {
        padding: 0 10px;
      }
    }

    .google-button {
      border: 1px solid var(--border-light);
      background: var(--bg-main);
      color: var(--text-main);
      height: 42px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.2s;
      width: 100%;

      &:hover:not(:disabled) {
        background-color: var(--bg-sub);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .google-icon {
      flex-shrink: 0;
    }
  `,
})
export default class AuthComponent {
  email = '';
  password = '';
  confirmPassword = '';
  isLoginTab = signal(true);
  authLoading = signal(false);
  errorMessage = signal('');

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      const loading = this.authService.loading();
      if (!loading && user) {
        // Automatically redirect away if user is already authenticated
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      }
    });
  }

  setTab(isLogin: boolean) {
    this.isLoginTab.set(isLogin);
    this.errorMessage.set('');
    this.password = '';
    this.confirmPassword = '';
  }

  async onSubmit(event: Event) {
    event.preventDefault();
    this.errorMessage.set('');

    if (!this.email || !this.password) {
      this.errorMessage.set('Veuillez remplir tous les champs requis.');
      return;
    }

    if (!this.isLoginTab()) {
      if (this.password !== this.confirmPassword) {
        this.errorMessage.set('Les mots de passe ne correspondent pas.');
        return;
      }
      if (this.password.length < 6) {
        this.errorMessage.set('Le mot de passe doit contenir au moins 6 caractères.');
        return;
      }
    }

    this.authLoading.set(true);

    try {
      if (this.isLoginTab()) {
        await this.authService.loginWithEmail(this.email, this.password);
      } else {
        await this.authService.registerWithEmail(this.email, this.password);
      }
      this.handleSuccessRedirect();
    } catch (err: any) {
      this.errorMessage.set(this.formatFirebaseError(err.code));
      this.authLoading.set(false);
    }
  }

  async loginWithGoogle() {
    this.errorMessage.set('');
    this.authLoading.set(true);

    try {
      await this.authService.loginWithGoogle();
      this.handleSuccessRedirect();
    } catch (err: any) {
      this.errorMessage.set(this.formatFirebaseError(err.code));
      this.authLoading.set(false);
    }
  }

  private handleSuccessRedirect() {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.router.navigateByUrl(returnUrl);
  }

  private formatFirebaseError(code: string): string {
    switch (code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email ou mot de passe incorrect.';
      case 'auth/email-already-in-use':
        return 'Cet e-mail est déjà associé à un compte.';
      case 'auth/invalid-email':
        return 'Adresse e-mail invalide.';
      case 'auth/weak-password':
        return 'Le mot de passe est trop faible.';
      case 'auth/popup-closed-by-user':
        return 'La fenêtre de connexion Google a été fermée.';
      default:
        return 'Une erreur inattendue est survenue. Veuillez réessayer.';
    }
  }
}

