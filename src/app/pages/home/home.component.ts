import { Component } from '@angular/core';
import { ProductListComponent } from '../products/product-list/product-list.component';

@Component({
  selector: 'app-home',
  imports: [ProductListComponent],
  template: `
    <section class="hero-section">
      <div class="hero-content">
        <h2>Bienvenue sur bitu-yetu</h2>
        <h3>Votre destination d'exception pour la mode, les bijoux et le meilleur de la technologie.</h3>
      </div>
    </section>
    <div class="main-content max-width">
      <app-product-list
        productTitle="Vêtements pour femmes"
        query="women's clothing"
        [queryLimitCount]="4"
      />
      <app-product-list
        productTitle="Vêtements pour hommes"
        query="men's clothing"
        [queryLimitCount]="4"
      />
      <app-product-list
        productTitle="Bijoux"
        query="jewelery"
        [queryLimitCount]="4"
      />
       <app-product-list
        productTitle="Électroniques"
        query="electronics"
        [queryLimitCount]="4"
      />
    </div>
    <br /><br />
  `,
  styles: `
    .hero-section {
      background: var(--bg-sub);
      border-bottom: 1px solid var(--border-light);
      padding: 5rem 1.5rem;
      text-align: center;
      color: var(--text-main);
      margin-bottom: 2.5rem;
    }

    .hero-content {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      h2 {
        font-size: 2.25rem;
        font-weight: 800;
        margin: 0;
        letter-spacing: -0.025em;
        animation: fadeIn 0.6s ease-out;
      }

      h3 {
        font-size: 1.1rem;
        font-weight: 400;
        color: var(--text-muted);
        margin: 0;
        line-height: 1.5;
        animation: fadeIn 0.8s ease-out;
      }
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

    .main-content {
      padding: 0 1rem;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
  `,
})
export default class HomeComponent {}
