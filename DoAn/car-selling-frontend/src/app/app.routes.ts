import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main/main.component').then((m) => m.MainComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.component').then((m) => m.RegisterComponent),
      },
      {
        path: 'list',
        loadComponent: () =>
          import('./pages/car-list/car-list.component').then(m => m.CarListComponent)
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('./pages/car-detail/car-detail.component').then(m => m.CarDetailComponent)
      },
      {
        path: 'checkout/:id',
        loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
      },           
      {
        path: 'checkout-success/:orderId',
        loadComponent: () => import('./pages/checkout-success/checkout-success.component').then(m => m.CheckoutSuccessComponent)
      }      
      
    ],
  },
  // Thêm route cho admin login
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./pages/admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadComponent: () =>
      import('./layouts/admin-layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./layouts/admin-layout/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'user',
        loadComponent: () =>
          import('./pages/admin/user-manager/user-manager.component').then((m) => m.UserManagerComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/admin/user-manager/user-list/user-list.component').then((m) => m.UserListComponent),
          },
        ],
      },
      {
        path: 'car',
        loadComponent: () =>
          import('./pages/admin/car-manager/car-manager.component').then((m) => m.CarManagerComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/admin/car-manager/car-list/car-list.component').then((m) => m.CarListComponent),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./pages/admin/car-manager/car-create/car-create.component').then((m) => m.CarCreateComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./pages/admin/car-manager/car-edit/car-edit.component').then((m) => m.CarEditComponent),
          },
        ],
      },
      {
        path: 'modelline',
        loadComponent: () =>
          import('./pages/admin/modelline-manager/modelline-manager.component').then((m) => m.ModellineManagerComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/admin/modelline-manager/modelline-list/modelline-list.component').then((m) => m.ModellineListComponent),
          },
          {
            path: 'create',
            loadComponent: () =>
              import('./pages/admin/modelline-manager/modelline-create/modelline-create.component').then((m) => m.ModellineCreateComponent),
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./pages/admin/modelline-manager/modelline-edit/modelline-edit.component').then((m) => m.ModellineEditComponent),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
