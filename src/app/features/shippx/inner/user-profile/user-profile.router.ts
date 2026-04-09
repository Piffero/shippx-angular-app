import { Routes } from '@angular/router';

export const userProfileRouter: Routes = [
    { path: ':id', loadComponent: () => import('./form/form').then(m => m.Form) },
    { path: 'details/:id', loadComponent: () => import('./details/details').then(m => m.Details) }
];