import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Title } from '@angular/platform-browser';
import { ProductListComponent } from '../products/product-list/product-list.component';
import { CartService } from '../../core/services/cart.service';
import { ProductSkeletonComponent } from '../shared/skeletons/product-skeleton/product-skeleton.component';

@Component({
  selector: 'app-product',
  imports: [ProductListComponent, ProductSkeletonComponent],
  templateUrl: './product.component.html',
  styles: `
    .produit-container {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin: 2rem auto !important;
      img {
        width: 50%;
      }
      .product-info {
        width: 40%;
      }
    }
    button:disabled {
      background: grey;
      opacity: 0.5;
    }
    .quantity-container {
      display: flex;
      align-items: center;
    }

    .label {
      font-size: 14px;
      font-weight: 500;
    }

    .quantity-box {
      width: 110px;
      height: 40px;
      background: #efefef;
      border-radius: 20px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 0 4px;
    }

    .quant {
      width: 32px;
      height: 32px;
      color: var(--bg-main);
      border: none;
      border-radius: 50%;
      background: var(--primary);

      font-size: 18px;
      cursor: pointer;
    }

    .qty-value {
      font-size: 16px;
      font-weight: bold;
    }

    .panier {
      background: var(--primary);
      color: var(--bg-main) !important;
      border: 1px solid var(--border-light);
      padding: 0.8rem;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--primary-hover);
        border-color: var(--primary-hover);
      }
    }
    /* ================= Responsive ================= */

    @media (max-width: 768px) {
      .produit-container {
        flex-direction: column;
        gap: 2rem;

        img {
          width: 100%;
          max-width: 350px;
          margin: 0 auto;
          display: block;
        }

        .product-info {
          width: 100%;
        }
      }

      .quantity-container {
        gap: 1rem;
        flex-wrap: wrap;
      }

      .panier {
        width: 100%;
      }
    }
  `,
})
export default class ProductComponent implements OnInit, OnDestroy {
  product?: Product;
  route = inject(ActivatedRoute);
  api = inject(ApiService);
  cartService = inject(CartService);
  loading = signal(true);
  title = inject(Title);
  routeSub?: Subscription;
  productQty = signal(1);

  ngOnInit(): void {
    this.routeSub = this.route.params
      .pipe(switchMap((params) => this.api.getProduit(params['id'])))
      .subscribe((produit) => {
        this.product = produit;
        this.title.setTitle(`${this.product.title} - bitu-yetu`);
        this.loading.set(false);
      });
  }

  qtyHandling(operation: string) {
    if (operation === 'add') {
      this.productQty.update((value) => value + 1);
    } else {
      this.productQty.update((value) => value - 1);
    }
  }

  addToCard(product: Product) {
    this.cartService.addToCart(product, this.productQty());
    this.productQty.set(1);
  }
  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }
}
