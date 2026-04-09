import { Routes } from '@angular/router';

export const opportunityRoutes: Routes = [
    { path: '', loadComponent: () => import('./grid/grid').then(m => m.Grid) },
    { path: ':id', loadComponent: () => import('./form/form').then(m => m.Form) }
];