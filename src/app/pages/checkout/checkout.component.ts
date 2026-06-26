import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { Order, ShippingAddress } from '../../core/models/order.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  imports: [FormsModule],
  template: `
    <main class="checkout-page max-width">
      @if (cartService.cartItems().length === 0 && activeStep() !== 3) {
        <div class="empty-checkout">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="64px"
            viewBox="0 -960 960 960"
            width="64px"
            fill="var(--text-muted)"
          >
            <path
              d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z"
            />
          </svg>
          <h3>Votre panier est vide</h3>
          <p>Ajoutez des articles à votre panier pour finaliser une commande.</p>
          <button class="home-btn" (click)="goToHome()">Retour à l'accueil</button>
        </div>
      } @else {
        <!-- Stepper Indicators -->
        <div class="stepper">
          <div class="step" [class.active]="activeStep() >= 1" [class.completed]="activeStep() > 1">
            <span class="step-num">1</span>
            <span class="step-label">Livraison</span>
          </div>
          <div class="step-line" [class.filled]="activeStep() > 1"></div>
          <div class="step" [class.active]="activeStep() >= 2" [class.completed]="activeStep() > 2">
            <span class="step-num">2</span>
            <span class="step-label">Paiement</span>
          </div>
          <div class="step-line" [class.filled]="activeStep() > 2"></div>
          <div class="step" [class.active]="activeStep() === 3" [class.completed]="activeStep() === 3">
            <span class="step-num">3</span>
            <span class="step-label">Confirmation</span>
          </div>
        </div>

        @if (activeStep() === 3) {
          <!-- STEP 3: CONFIRMATION SUCCESS -->
          <div class="success-container">
            <div class="step-card success-card">
              <div class="success-icon-wrapper">
                <svg
                  class="success-checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <h2>Commande Validée !</h2>
              <p class="success-intro">
                Merci pour votre achat ! Votre paiement a été traité avec succès et votre commande a été validée.
              </p>

              <div class="order-receipt">
                <div class="receipt-row">
                  <span class="label">Numéro de Commande</span>
                  <span class="value order-id">{{ lastOrderId() }}</span>
                </div>
                <div class="receipt-row">
                  <span class="label">Montant Payé</span>
                  <span class="value price">$ {{ lastOrderAmount().toFixed(2) }}</span>
                </div>
                <div class="receipt-row">
                  <span class="label">Méthode de paiement</span>
                  <span class="value payment-type">
                    @if (selectedPaymentMethod() === 'card') {
                      Carte Bancaire
                    } @else if (selectedPaymentMethod() === 'paypal') {
                      PayPal ({{ payment.paypalEmail }})
                    } @else {
                      Mobile Money ({{ payment.mobileOperator.toUpperCase() }})
                    }
                  </span>
                </div>
                <div class="receipt-row">
                  <span class="label">Adresse de livraison</span>
                  <span class="value address">
                    {{ shipping.firstName }} {{ shipping.lastName }}<br />
                    {{ shipping.address }}, {{ shipping.zipCode }} {{ shipping.city }}
                  </span>
                </div>
              </div>

              <div class="success-actions">
                <button class="action-btn next-btn" (click)="goToHome()">
                  Continuer mes achats
                </button>
                <button class="back-btn orders-btn" (click)="goToOrders()">
                  Voir l'historique de mes commandes
                </button>
              </div>
            </div>
          </div>
        } @else {
          <div class="checkout-layout">
            <!-- Main forms side -->
            <div class="checkout-content">
            <!-- STEP 1: SHIPPING -->
            @if (activeStep() === 1) {
              <div class="step-card">
                <h3>Informations de Livraison</h3>
                <form (submit)="submitShipping($event)" class="checkout-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label for="firstName">Prénom</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        [(ngModel)]="shipping.firstName"
                        required
                        class="form-input"
                      />
                    </div>
                    <div class="form-group">
                      <label for="lastName">Nom de famille</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        [(ngModel)]="shipping.lastName"
                        required
                        class="form-input"
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="address">Adresse complète</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      [(ngModel)]="shipping.address"
                      required
                      placeholder="Rue, numéro de porte, appartement..."
                      class="form-input"
                    />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label for="city">Ville</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        [(ngModel)]="shipping.city"
                        required
                        class="form-input"
                      />
                    </div>
                    <div class="form-group">
                      <label for="zipCode">Code Postal</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        [(ngModel)]="shipping.zipCode"
                        required
                        placeholder="75001"
                        class="form-input"
                      />
                    </div>
                  </div>

                  <div class="form-group">
                    <label for="phone">Numéro de Téléphone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      [(ngModel)]="shipping.phone"
                      required
                      placeholder="06 12 34 56 78"
                      class="form-input"
                    />
                  </div>

                  <button type="submit" class="action-btn next-btn">
                    Continuer vers le paiement
                  </button>
                </form>
              </div>
            }

            <!-- STEP 2: PAYMENT -->
            @if (activeStep() === 2) {
              <div class="step-card">
                <h3>Détails du Paiement</h3>
                
                <!-- Payment Switcher tabs -->
                <div class="payment-methods-tabs">
                  <button
                    type="button"
                    class="tab-btn"
                    [class.active]="selectedPaymentMethod() === 'card'"
                    (click)="selectedPaymentMethod.set('card')"
                  >
                    <span class="tab-icon">💳</span>
                    Carte Bancaire
                  </button>
                  <button
                    type="button"
                    class="tab-btn"
                    [class.active]="selectedPaymentMethod() === 'paypal'"
                    (click)="selectedPaymentMethod.set('paypal')"
                  >
                    <span class="tab-icon">🅿️</span>
                    PayPal
                  </button>
                  <button
                    type="button"
                    class="tab-btn"
                    [class.active]="selectedPaymentMethod() === 'mobile'"
                    (click)="selectedPaymentMethod.set('mobile')"
                  >
                    <span class="tab-icon">📱</span>
                    Mobile Money
                  </button>
                </div>

                <!-- Visual Interactive Card (only for Card payment method) -->
                @if (selectedPaymentMethod() === 'card') {
                  <div class="visual-card-wrapper">
                    <div class="credit-card" [class.flipped]="isCvvFocused()">
                      <!-- Front side -->
                      <div class="card-front">
                        <div class="card-chip-row">
                          <div class="card-chip"></div>
                          <span class="card-brand">VISA</span>
                        </div>
                        <div class="card-number-display">
                          {{ formatCardNumber(payment.cardNumber) || '•••• •••• •••• ••••' }}
                        </div>
                        <div class="card-meta-row">
                          <div class="card-holder">
                            <span class="card-label">Titulaire</span>
                            <span class="card-value">{{ payment.cardName.toUpperCase() || 'VOTRE NOM' }}</span>
                          </div>
                          <div class="card-expiry">
                            <span class="card-label">Expire fin</span>
                            <span class="card-value">{{ payment.cardExpiry || 'MM/YY' }}</span>
                          </div>
                        </div>
                      </div>
                      <!-- Back side -->
                      <div class="card-back">
                        <div class="card-stripe"></div>
                        <div class="card-signature-bar">
                          <span class="card-cvv-val">{{ payment.cardCvv || '•••' }}</span>
                        </div>
                        <div class="card-back-text">Paiement sécurisé crypté SSL de bout en bout.</div>
                      </div>
                    </div>
                  </div>
                }

                <form (submit)="submitPayment($event)" class="checkout-form">
                  
                  <!-- CREDIT CARD FORM FIELDS -->
                  @if (selectedPaymentMethod() === 'card') {
                    <div class="form-group">
                      <label for="cardName">Nom sur la carte</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        [(ngModel)]="payment.cardName"
                        required
                        placeholder="Prénom Nom"
                        class="form-input"
                      />
                    </div>

                    <div class="form-group">
                      <label for="cardNumber">Numéro de carte</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        [(ngModel)]="payment.cardNumber"
                        (input)="onCardNumberInput($event)"
                        maxlength="19"
                        required
                        placeholder="4532 7100 1234 5678"
                        class="form-input"
                      />
                    </div>

                    <div class="form-row">
                      <div class="form-group">
                        <label for="cardExpiry">Date d'expiration</label>
                        <input
                          type="text"
                          id="cardExpiry"
                          name="cardExpiry"
                          [(ngModel)]="payment.cardExpiry"
                          (input)="onExpiryInput($event)"
                          maxlength="5"
                          required
                          placeholder="MM/YY"
                          class="form-input"
                        />
                      </div>
                      <div class="form-group">
                        <label for="cardCvv">Code de sécurité (CVV)</label>
                        <input
                          type="password"
                          id="cardCvv"
                          name="cardCvv"
                          [(ngModel)]="payment.cardCvv"
                          (focus)="isCvvFocused.set(true)"
                          (blur)="isCvvFocused.set(false)"
                          maxlength="3"
                          required
                          placeholder="123"
                          class="form-input"
                        />
                      </div>
                    </div>
                  }

                  <!-- PAYPAL FORM FIELDS -->
                  @if (selectedPaymentMethod() === 'paypal') {
                    <div class="paypal-form-content">
                      <div class="payment-info-box">
                        <div class="paypal-badge-brand">PayPal</div>
                        <p>Sécurisé, simple et rapide. Vous allez finaliser l'achat en validant votre compte PayPal.</p>
                      </div>
                      <div class="form-group">
                        <label for="paypalEmail">Adresse e-mail du compte PayPal</label>
                        <input
                          type="email"
                          id="paypalEmail"
                          name="paypalEmail"
                          [(ngModel)]="payment.paypalEmail"
                          required
                          placeholder="votre.compte@paypal.com"
                          class="form-input"
                        />
                      </div>
                    </div>
                  }

                  <!-- MOBILE MONEY FORM FIELDS -->
                  @if (selectedPaymentMethod() === 'mobile') {
                    <div class="mobile-money-form-content">
                      <div class="payment-info-box">
                        <p>Payez directement depuis votre mobile. Une notification de validation de transaction s'affichera sur votre écran.</p>
                      </div>
                      <div class="form-row">
                        <div class="form-group">
                          <label for="mobileOperator">Opérateur</label>
                          <select
                            id="mobileOperator"
                            name="mobileOperator"
                            [(ngModel)]="payment.mobileOperator"
                            required
                            class="form-input"
                            style="height: 42px; background: white;"
                          >
                            <option value="">-- Choisir un opérateur --</option>
                            <option value="mpesa">M-Pesa (Vodacom)</option>
                            <option value="orange">Orange Money</option>
                            <option value="airtel">Airtel Money</option>
                          </select>
                        </div>
                        <div class="form-group">
                          <label for="mobilePhone">Numéro de téléphone mobile</label>
                          <input
                            type="tel"
                            id="mobilePhone"
                            name="mobilePhone"
                            [(ngModel)]="payment.mobilePhone"
                            required
                            placeholder="Ex: +243 812 345 678"
                            class="form-input"
                          />
                        </div>
                      </div>
                    </div>
                  }

                  @if (paymentError()) {
                    <p class="error-msg">{{ paymentError() }}</p>
                  }

                  <div class="buttons-row">
                    <button type="button" class="back-btn" [disabled]="paymentLoading()" (click)="activeStep.set(1)">
                      Retour
                    </button>
                    <button type="submit" class="action-btn pay-btn" [disabled]="paymentLoading() || !isPaymentValid()">
                      @if (paymentLoading()) {
                        <div class="spinner"></div>
                        <span>{{ processingStatus() }}</span>
                      } @else {
                        <span>Confirmer et payer $ {{ cartService.totalAmount().toFixed(2) }}</span>
                      }
                    </button>
                  </div>
                </form>
              </div>
            }

          </div>

          <!-- Invoice summary side (only shown on Step 1 & 2) -->
          @if (activeStep() < 3) {
            <aside class="checkout-summary">
              <div class="summary-card">
                <h4>Résumé de la commande</h4>
                <div class="summary-items">
                  @for (item of cartService.cartItems(); track item.product.id) {
                    <div class="summary-item">
                      <img [src]="item.product.image" [alt]="item.product.title" />
                      <div class="summary-item-info">
                        <span class="summary-item-title">{{ item.product.title }}</span>
                        <span class="summary-item-meta">Qté : {{ item.quantity }}</span>
                      </div>
                      <span class="summary-item-price">$ {{ (item.product.price * item.quantity).toFixed(2) }}</span>
                    </div>
                  }
                </div>

                <hr />

                <div class="pricing-table">
                  <div class="pricing-row">
                    <span>Sous-total</span>
                    <span>$ {{ cartService.totalAmount().toFixed(2) }}</span>
                  </div>
                  <div class="pricing-row">
                    <span>Livraison</span>
                    <span class="free-delivery">Gratuit</span>
                  </div>
                  <hr />
                  <div class="pricing-row total">
                    <span>Total</span>
                    <span class="grand-total">$ {{ cartService.totalAmount().toFixed(2) }}</span>
                  </div>
                </div>
              </div>
            </aside>
          }
        </div>
      }
      }
    </main>
  `,
  styles: `
    .checkout-page {
      padding: 3rem 1rem;
      min-height: calc(100vh - 120px);
    }

    .empty-checkout {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 5rem 1rem;
      color: var(--text-muted);
      border: 1px solid var(--border-light);
      background: var(--bg-sub);

      h3 {
        margin: 1.5rem 0 0.5rem;
        color: var(--text-main);
        font-size: 1.5rem;
        font-weight: 700;
      }

      p {
        margin-bottom: 2rem;
        font-size: 0.95rem;
      }
    }

    .home-btn {
      background: var(--primary);
      color: white;
      border: 1px solid var(--primary);
      padding: 0.75rem 2rem;
      font-weight: 600;
      cursor: pointer;
    }

    /* Stepper Indicators */
    .stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      max-width: 600px;
      margin: 0 auto 3rem;
      padding: 0 1rem;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      position: relative;
      z-index: 2;

      .step-num {
        width: 36px;
        height: 36px;
        background: var(--bg-sub);
        border: 1px solid var(--border-light);
        color: var(--text-muted);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: 0.9rem;
        transition: all 0.2s;
      }

      .step-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-muted);
        letter-spacing: 0.05em;
        transition: all 0.2s;
      }

      &.active {
        .step-num {
          background: #ffffff;
          border-color: var(--primary);
          color: var(--primary);
          border-width: 2px;
        }
        .step-label {
          color: var(--primary);
          font-weight: 700;
        }
      }

      &.completed {
        .step-num {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        .step-label {
          color: var(--text-main);
        }
      }
    }

    .step-line {
      flex: 1;
      height: 1px;
      background: var(--border-light);
      margin: -24px 8px 0;
      position: relative;
      z-index: 1;

      &.filled {
        background: var(--primary);
      }
    }

    .success-container {
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }

    /* Layout */
    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr;
      gap: 3rem;
      align-items: start;

      @media (min-width: 1024px) {
        grid-template-columns: 1.4fr 1fr;
      }
    }

    .step-card {
      background: var(--bg-sub);
      border: 1px solid var(--border-light);
      padding: 2.5rem;

      h3 {
        margin: 0 0 2rem;
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--text-main);
        letter-spacing: 0.05em;
      }
    }

    /* Payment switcher tabs */
    .payment-methods-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border-light);
      padding-bottom: 16px;
    }

    .tab-btn {
      flex: 1;
      background: transparent;
      border: 1px solid var(--border-light);
      color: var(--text-muted);
      padding: 12px;
      font-weight: 600;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease-in-out;
      border-radius: 0px;

      &.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }

      &:hover:not(.active) {
        background: var(--accent-beige);
        color: var(--text-main);
      }
    }

    .payment-info-box {
      background: var(--bg-main);
      border: 1px solid var(--border-light);
      padding: 1.25rem;
      margin-bottom: 1.75rem;
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.6;

      .paypal-badge-brand {
        font-size: 1.15rem;
        font-weight: 800;
        font-style: italic;
        color: var(--text-main);
        margin-bottom: 6px;
      }
    }

    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1.25rem;

      @media (min-width: 640px) {
        grid-template-columns: 1fr 1fr;
      }
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-main);
        letter-spacing: 0.05em;
      }
    }

    .form-input {
      width: 100%;
      height: 44px;
      padding: 0 14px;
      border: 1px solid var(--border-light);
      background: #ffffff;
      font-size: 0.9rem;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s;
      border-radius: 0px;
      color: var(--text-main);

      &:focus {
        border-color: var(--primary);
      }
    }

    .action-btn {
      background: var(--primary);
      color: white;
      border: 1px solid var(--primary);
      padding: 1rem;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      letter-spacing: 0.05em;

      &:hover:not(:disabled) {
        background: var(--primary-hover);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .next-btn {
      margin-top: 1.5rem;
      width: 100%;
    }

    .buttons-row {
      display: flex;
      gap: 1.25rem;
      margin-top: 1.5rem;

      .back-btn {
        flex: 1;
        background: transparent;
        border: 1px solid var(--border-light);
        color: var(--text-main);
        font-weight: 600;
        cursor: pointer;
        border-radius: 0px;

        &:hover:not(:disabled) {
          background: var(--accent-beige);
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .pay-btn {
        flex: 2;
      }
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error-msg {
      color: #7a1c1c;
      font-size: 0.85rem;
      font-weight: 600;
      margin: 0;
      background: #fbf0f0;
      border-left: 3px solid #7a1c1c;
      padding: 8px 12px;
    }

    /* Virtual Credit Card Styles */
    .visual-card-wrapper {
      perspective: 1000px;
      display: flex;
      justify-content: center;
      margin-bottom: 2.5rem;
    }

    .credit-card {
      width: 100%;
      max-width: 320px;
      height: 190px;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border-radius: 4px;
      border: 1px solid var(--border-light);

      &.flipped {
        transform: rotateY(180deg);
      }
    }

    .card-front, .card-back {
      width: 100%;
      height: 100%;
      position: absolute;
      backface-visibility: hidden;
      border-radius: 4px;
      padding: 1.5rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: white;
    }

    .card-front {
      background: #111111;
      z-index: 2;
      transform: rotateY(0deg);
    }

    .card-back {
      background: #1c1c1c;
      transform: rotateY(180deg);
      padding: 1.5rem 0;
      justify-content: flex-start;
      gap: 1.25rem;
    }

    .card-chip-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .card-chip {
        width: 38px;
        height: 28px;
        background: #e9e4d9;
        border-radius: 4px;
      }

      .card-brand {
        font-weight: 900;
        font-style: italic;
        font-size: 1.4rem;
        letter-spacing: -0.05em;
        color: white;
      }
    }

    .card-number-display {
      font-size: 1.15rem;
      letter-spacing: 0.1em;
      font-weight: 700;
      font-family: monospace;
    }

    .card-meta-row {
      display: flex;
      justify-content: space-between;

      .card-label {
        font-size: 0.6rem;
        text-transform: uppercase;
        color: #8c8c8c;
        display: block;
        margin-bottom: 2px;
      }

      .card-value {
        font-size: 0.8rem;
        font-weight: 600;
        font-family: monospace;
      }
    }

    .card-stripe {
      height: 38px;
      background: #000000;
      width: 100%;
    }

    .card-signature-bar {
      height: 32px;
      background: rgba(255, 255, 255, 0.95);
      margin: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right: 12px;

      .card-cvv-val {
        color: #000000;
        font-weight: 700;
        font-style: italic;
        letter-spacing: 0.05em;
      }
    }

    .card-back-text {
      font-size: 0.55rem;
      color: #8c8c8c;
      padding: 0 1.5rem;
      line-height: 1.3;
    }

    /* Invoice Summary Sidebar */
    .checkout-summary {
      position: sticky;
      top: 80px;
    }

    .summary-card {
      background: var(--bg-sub);
      border: 1px solid var(--border-light);
      padding: 2rem;

      h4 {
        margin: 0 0 1.5rem;
        font-size: 1.1rem;
        color: var(--text-main);
        font-weight: 700;
        letter-spacing: 0.05em;
      }
    }

    .summary-items {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      max-height: 250px;
      overflow-y: auto;
      padding-right: 6px;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 12px;

      img {
        width: 48px;
        height: 48px;
        object-fit: contain;
        background: white;
        padding: 4px;
        border: 1px solid var(--border-light);
        flex-shrink: 0;
      }

      .summary-item-info {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        min-width: 0;

        .summary-item-title {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .summary-item-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
      }

      .summary-item-price {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-main);
      }
    }

    .pricing-table {
      display: flex;
      flex-direction: column;
      gap: 10px;
      font-size: 0.85rem;
      color: var(--text-muted);

      .free-delivery {
        color: var(--text-main);
        font-weight: 700;
      }

      .total {
        font-size: 1rem;
        color: var(--text-main);
        font-weight: 700;

        .grand-total {
          font-size: 1.3rem;
          color: var(--primary);
          font-weight: 800;
        }
      }
    }

    .pricing-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    hr {
      border: none;
      border-top: 1px solid var(--border-light);
      margin: 1.25rem 0;
    }

    /* Step 3 Success Card Animations */
    .success-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 4rem 2rem;

      h2 {
        font-size: 1.8rem;
        margin: 1.5rem 0 0.5rem;
        color: var(--text-main);
        font-weight: 700;
        letter-spacing: 0.05em;
      }

      .success-intro {
        color: var(--text-muted);
        font-size: 0.95rem;
        max-width: 480px;
        margin-bottom: 2.5rem;
        line-height: 1.5;
      }
    }

    .success-icon-wrapper {
      display: flex;
      justify-content: center;
    }

    .success-checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: block;
      stroke-width: 2;
      stroke: var(--primary);
      stroke-miterlimit: 10;
      box-shadow: inset 0px 0px 0px var(--primary);
      animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s forwards;
    }

    .checkmark-circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      stroke-miterlimit: 10;
      stroke: var(--primary);
      fill: none;
      animation: stroke .6s cubic-bezier(.65,0,.45,1) forwards;
    }

    .checkmark-check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      stroke-width: 3;
      animation: stroke .3s cubic-bezier(.65,0,.45,1) .8s forwards;
    }

    @keyframes stroke {
      100% { stroke-dashoffset: 0; }
    }

    @keyframes scale {
      0%, 100% { transform: none; }
      50% { transform: scale3d(1.1, 1.1, 1); }
    }

    @keyframes fill {
      100% { box-shadow: inset 0px 0px 0px 40px rgba(0, 0, 0, 0.05); }
    }

    .order-receipt {
      background: var(--bg-main);
      border: 1px solid var(--border-light);
      padding: 1.5rem;
      width: 100%;
      max-width: 440px;
      margin-bottom: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 14px;
      text-align: left;
    }

    .receipt-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;

      .label {
        color: var(--text-muted);
        font-weight: 500;
        font-size: 0.75rem;
        letter-spacing: 0.05em;
      }

      .value {
        color: var(--text-main);
        font-weight: 600;
        text-align: right;

        &.order-id {
          font-family: monospace;
          color: var(--text-main);
          font-size: 0.9rem;
        }

        &.price {
          color: var(--text-main);
          font-weight: 800;
        }

        &.address {
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--text-muted);
          line-height: 1.4;
        }
      }
    }

    .success-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      max-width: 320px;

      .action-btn {
        width: 100%;
      }

      .orders-btn {
        background: transparent;
        border: 1px solid var(--border-light);
        color: var(--text-main);
        font-weight: 600;
        padding: 0.85rem;
        cursor: pointer;
        transition: background 0.2s;
        border-radius: 0px;
        font-size: 0.85rem;
        letter-spacing: 0.05em;

        &:hover {
          background: var(--accent-beige);
        }
      }
    }
  `,
})
export default class CheckoutComponent implements OnInit {
  activeStep = signal(1);
  selectedPaymentMethod = signal<'card' | 'paypal' | 'mobile'>('card');
  paymentLoading = signal(false);
  paymentError = signal('');
  processingStatus = signal('Traitement...');
  
  lastOrderId = signal('');
  lastOrderAmount = signal(0);

  shipping: ShippingAddress = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
  };

  payment = {
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    paypalEmail: '',
    mobileOperator: '',
    mobilePhone: '',
  };

  isCvvFocused = signal(false);

  cartService = inject(CartService);
  private authService = inject(AuthService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      const loading = this.authService.loading();
      const user = this.authService.currentUser();
      if (!loading) {
        if (!user) {
          this.router.navigate(['/auth'], {
            queryParams: { returnUrl: '/checkout' },
          });
        }
      }
    });
  }

  ngOnInit() {
    // Left empty since active auth check is reactive in effect() inside constructor
  }

  submitShipping(event: Event) {
    event.preventDefault();
    if (this.isShippingValid()) {
      this.activeStep.set(2);
    }
  }

  async submitPayment(event: Event) {
    event.preventDefault();
    this.paymentError.set('');

    if (!this.isPaymentValid()) {
      this.paymentError.set('Veuillez remplir correctement les informations de paiement.');
      return;
    }

    const user = this.authService.currentUser();
    if (!user) {
      this.paymentError.set("Session expirée. Veuillez vous reconnecter.");
      return;
    }

    this.paymentLoading.set(true);

    let statuses: string[] = [];
    if (this.selectedPaymentMethod() === 'card') {
      statuses = [
        'Vérification de la carte...',
        'Autorisation de la banque...',
        'Sécurisation de la commande...',
      ];
    } else if (this.selectedPaymentMethod() === 'paypal') {
      statuses = [
        'Connexion à PayPal...',
        'Validation du compte PayPal...',
        'Finalisation de la commande...',
      ];
    } else {
      statuses = [
        'Envoi de la notification de paiement...',
        'Attente de confirmation du code PIN...',
        'Validation de la transaction...',
      ];
    }

    let currentStatusIndex = 0;
    this.processingStatus.set(statuses[0]);

    const statusInterval = setInterval(() => {
      currentStatusIndex++;
      if (currentStatusIndex < statuses.length) {
        this.processingStatus.set(statuses[currentStatusIndex]);
      }
    }, 800);

    try {
      // Prepare Order
      const newOrder: Order = {
        userId: user.uid,
        userEmail: user.email || '',
        items: [...this.cartService.cartItems()],
        totalAmount: this.cartService.totalAmount(),
        shippingAddress: { ...this.shipping },
        status: 'Payée',
        createdAt: null, // will be written by order.service with a Date
      };

      // Save to Firestore
      const savedDoc = await this.orderService.createOrder(newOrder);
      
      // Store info for success screen
      this.lastOrderId.set(savedDoc.id);
      this.lastOrderAmount.set(this.cartService.totalAmount());

      // Delay success slightly to finish animations
      setTimeout(() => {
        clearInterval(statusInterval);
        this.activeStep.set(3);
        this.cartService.clearCart();
        this.paymentLoading.set(false);
      }, 2500);

    } catch (err: any) {
      clearInterval(statusInterval);
      this.paymentLoading.set(false);
      this.paymentError.set("Erreur lors de l'enregistrement de votre commande. " + err.message);
    }
  }

  // Utilities & Formatters
  onCardNumberInput(event: any) {
    let input = event.target.value.replace(/\D/g, ''); // remove non-digits
    let formatted = '';
    for (let i = 0; i < input.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += input[i];
    }
    this.payment.cardNumber = formatted;
  }

  onExpiryInput(event: any) {
    let input = event.target.value.replace(/\D/g, '');
    let formatted = '';
    if (input.length > 2) {
      formatted = input.substring(0, 2) + '/' + input.substring(2, 4);
    } else {
      formatted = input;
    }
    this.payment.cardExpiry = formatted;
  }

  formatCardNumber(num: string): string {
    return num;
  }

  isShippingValid(): boolean {
    return !!(
      this.shipping.firstName.trim() &&
      this.shipping.lastName.trim() &&
      this.shipping.address.trim() &&
      this.shipping.city.trim() &&
      this.shipping.zipCode.trim() &&
      this.shipping.phone.trim()
    );
  }

  isPaymentValid(): boolean {
    if (this.selectedPaymentMethod() === 'card') {
      const rawCard = this.payment.cardNumber.replace(/\s/g, '');
      return (
        this.payment.cardName.trim().length >= 3 &&
        rawCard.length === 16 &&
        this.payment.cardExpiry.length === 5 &&
        this.payment.cardCvv.length === 3
      );
    } else if (this.selectedPaymentMethod() === 'paypal') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(this.payment.paypalEmail.trim());
    } else if (this.selectedPaymentMethod() === 'mobile') {
      return !!(
        this.payment.mobileOperator &&
        this.payment.mobilePhone.trim().length >= 8
      );
    }
    return false;
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }
}
