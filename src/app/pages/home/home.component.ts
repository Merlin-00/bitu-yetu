import { Component } from '@angular/core';
import { ProductListComponent } from '../products/product-list/product-list.component';
import { SearchBarComponent } from '../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-home',
  imports: [ProductListComponent, SearchBarComponent],
  template: `
    <section class="hero-section">
      <div class="hero-content">
        <h2>Bienvenue sur bitu-yetu</h2>
        <h3>La boutique en ligne de démonstration Angular moderne</h3>
        <div class="hero-search">
          <app-search-bar />
        </div>
      </div>
    </section>
    <div class="main-content max-width">
      <app-product-list
        productTitle="Électroniques"
        query="electronics"
        [queryLimitCount]="4"
      />
      <app-product-list
        productTitle="Bijoux"
        query="jewelery"
        [queryLimitCount]="4"
      />
      <app-product-list
        productTitle="Vêtements pour hommes"
        query="men's clothing"
        [queryLimitCount]="4"
      />
      <app-product-list
        productTitle="Vêtements pour femmes"
        query="women's clothing"
        [queryLimitCount]="4"
      />
    </div>
    <br /><br />
  `,
  styles: `
    .hero-section {
      background: linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #818cf8 100%);
      padding: 4rem 1.5rem;
      text-align: center;
      color: white;
      position: relative;
      overflow: hidden;
      margin-bottom: 2rem;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40px;
        background: linear-gradient(to top, #ffffff, transparent);
        pointer-events: none;
      }
    }

    .hero-content {
      max-width: 600px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      z-index: 2;
      position: relative;

      h2 {
        font-size: 2.5rem;
        font-weight: 800;
        margin: 0;
        letter-spacing: -0.025em;
        text-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
        animation: fadeInUp 0.6s ease-out;
      }

      h3 {
        font-size: 1.2rem;
        font-weight: 400;
        color: #e0e7ff;
        margin: 0 0 1rem 0;
        text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        animation: fadeInUp 0.8s ease-out;
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hero-search {
      width: 100%;
      display: flex;
      justify-content: center;
      animation: fadeInUp 1s ease-out;

      ::ng-deep .search-container {
        max-width: 100%;
      }

      ::ng-deep .search-input-wrapper {
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        height: 48px;
        border-radius: 14px;

        &:focus-within {
          background: #ffffff;
          border-color: #ffffff;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
          
          .search-input {
            color: #0f172a;
          }
          
          .search-icon {
            fill: #4f46e5;
          }
        }
      }

      ::ng-deep .search-input {
        color: white;
        font-size: 1rem;
        &::placeholder {
          color: #c7d2fe;
        }
      }

      ::ng-deep .search-icon {
        fill: #c7d2fe;
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
