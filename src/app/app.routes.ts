import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'shippx', loadChildren: () => import('./features/shippx/shippx.router').then(m => m.shippxRoutes)},
    {path: 'system', loadChildren: () => import('./features/admin/admin.router').then(m => m.adminRoutes)},
    {path: '**', redirectTo: 'shippx', pathMatch: 'full'}
];
