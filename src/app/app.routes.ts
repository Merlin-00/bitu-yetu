import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'bitu-yetu | Accueil',
    loadComponent: () => import('./pages/home/home.component'),
  },
  {
    path: 'products/:category',
    loadComponent: () => import('./pages/products/products.component'),
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product/product.component'),
  },
  {
    path: 'auth',
    title: 'bitu-yetu | Connexion',
    loadComponent: () => import('./pages/auth/auth.component'),
  },
  {
    path: 'checkout',
    title: 'bitu-yetu | Finaliser ma commande',
    loadComponent: () => import('./pages/checkout/checkout.component'),
  },
  {
    path: 'orders',
    title: 'bitu-yetu | Mes Commandes',
    loadComponent: () => import('./pages/orders/order-history.component'),
  },
];
