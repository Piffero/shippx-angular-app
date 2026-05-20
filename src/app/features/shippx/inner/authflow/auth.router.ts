import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth.component').then(c => c.AuthComponent),
    children: [
      { path: 'signin', loadComponent: () => import('./components/signin/signin').then(c => c.SignIn) },
      { path: 'signup', loadComponent: () => import('./components/signup/signup').then(c => c.SignUp) },
      { path: 'forgot', loadComponent: () => import('./components/forgot/forgot').then(c => c.Forgot) },
      { path: '', redirectTo: 'signin', pathMatch: 'full' }
    ]
  }
];