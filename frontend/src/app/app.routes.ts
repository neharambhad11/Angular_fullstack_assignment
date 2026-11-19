import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
   {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component')
        .then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./features/auth/register/register.component')
        .then(m => m.Register)
  },

  {
    path: '',
    canActivate: [authGuard],
    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard/dashboard.component')
            .then(m => m.Dashboard)
      },

      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/product-list/product-list.component')
            .then(m => m.ProductList)
      },

      {
        path: 'products/new',
        loadComponent: () =>
          import('./features/products/product-form/product-form.component')
            .then(m => m.ProductForm)
      },

      {
        path: 'products/:id/edit',
        loadComponent: () =>
          import('./features/products/product-form/product-form.component')
            .then(m => m.ProductForm)
      },

      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/order-list/order-list.component')
            .then(m => m.OrderList)
      }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];