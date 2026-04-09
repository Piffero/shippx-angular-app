import { Routes } from '@angular/router';

export const routes: Routes = [
    {path: 'shippx', loadChildren: () => import('./features/shippx/shippx.router').then(m => m.shippxRoutes)},
    {path: '**', redirectTo: 'shippx', pathMatch: 'full'}
];
