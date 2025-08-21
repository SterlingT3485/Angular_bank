import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent)
  },
  {
    path: 'create-account',
    loadComponent: () => import('./pages/create-account/create-account').then(m => m.CreateAccountComponent)
  },
  {
    path: 'transfer',
    loadComponent: () => import('./pages/transfer/transfer').then(m => m.TransferComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./pages/history/history').then(m => m.HistoryComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
