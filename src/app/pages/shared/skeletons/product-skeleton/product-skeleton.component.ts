import { Component } from '@angular/core';

@Component({
  selector: 'app-product-skeleton',
  imports: [],
  template: `
<div class="produit-container">
  <div class="image skeleton-box"></div>

  <div class="product-info">
    <div class="title skeleton-box"></div>

    <div class="category skeleton-box"></div>

    <div class="price skeleton-box"></div>

    <div class="quantity">
      <div class="label skeleton-box"></div>

      <div class="btn skeleton-box"></div>
      <div class="number skeleton-box"></div>
      <div class="btn skeleton-box"></div>
    </div>

    <div class="divider"></div>

    <div class="total skeleton-box"></div>

    <div class="button skeleton-box"></div>

    <div class="divider"></div>

    <div class="description skeleton-box"></div>
    <div class="description skeleton-box"></div>
    <div class="description skeleton-box"></div>
    <div class="description short skeleton-box"></div>
  </div>
</div>
  `,
  styles: `
  .produit-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 2rem auto;
}

.image {
  width: 50%;
  height: 500px;
  border-radius: 10px;
}

.product-info {
  width: 40%;
}

.title {
  width: 90%;
  height: 32px;
  margin-bottom: 20px;
}

.category {
  width: 140px;
  height: 18px;
  margin-bottom: 20px;
}

.price {
  width: 100px;
  height: 28px;
  margin-bottom: 25px;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

.label {
  width: 80px;
  height: 18px;
}

.btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.number {
  width: 30px;
  height: 20px;
}

.total {
  width: 160px;
  height: 24px;
  margin: 25px 0;
}

.button {
  width: 220px;
  height: 48px;
  margin-bottom: 25px;
}

.description {
  width: 100%;
  height: 15px;
  margin-bottom: 12px;
}

.short {
  width: 65%;
}

.divider {
  width: 100%;
  height: 1px;
  background: #e5e5e5;
  margin: 20px 0;
}

/* Animation Skeleton */

.skeleton-box {
  background: linear-gradient(
    90deg,
    #ececec 25%,
    #f8f8f8 50%,
    #ececec 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -200% 0;
  }
}

/* Responsive */

@media (max-width: 768px) {
  .produit-container {
    flex-direction: column;
  }

  .image,
  .product-info {
    width: 100%;
  }

  .image {
    height: 350px;
  }

  .button {
    width: 100%;
  }
}
  `
})
export class ProductSkeletonComponent {

}
