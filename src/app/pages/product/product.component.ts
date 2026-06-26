import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { Title } from '@angular/platform-browser';
import { ProductListComponent } from '../products/product-list/product-list.component';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product',
  imports: [ProductListComponent],
  templateUrl: './product.component.html',
  styles: `
  .produit-container{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin: 2rem auto !important;
    img{
      width: 50%;
    }
    .product-info{
      width: 40%;
    }
  }
  button:disabled{
    background: grey;
    opacity: 0.5;
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
