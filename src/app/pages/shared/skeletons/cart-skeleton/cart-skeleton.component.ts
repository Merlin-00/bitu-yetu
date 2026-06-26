import { Component } from '@angular/core';

@Component({
  selector: 'app-cart-skeleton',
  imports: [],
  template: `
<header>
  <div class="title skeleton"></div>

  <div class="action skeleton"></div>
</header>

<div class="product-list">
  @for (item of [1,2,3,4]; track item) {

  <div class="product-card">

    <div class="image skeleton"></div>

    <div class="product-info">
      <div class="line skeleton"></div>
      <div class="line short skeleton"></div>
      <div class="price skeleton"></div>
    </div>

  </div>

  }
</div>
  `,
  styles: `
  header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title {
  width: 180px;
  height: 28px;
}

.action {
  width: 90px;
  height: 20px;
}

.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

.product-card {
  width: 250px;
  border: 1px solid #e4e4e4;
  border-radius: 8px;
  overflow: hidden;
}

.image {
  width: calc(100% - 1rem);
  height: 200px;
  margin: .5rem;
}

.product-info {
  padding: .5rem;
}

.line {
  width: 100%;
  height: 16px;
  margin-bottom: 10px;
}

.short {
  width: 70%;
}

.price {
  width: 80px;
  height: 20px;
}

.skeleton {
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    #ececec 25%,
    #f7f7f7 50%,
    #ececec 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.2s linear infinite;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}
  `
})
export class CartSkeletonComponent {

}
