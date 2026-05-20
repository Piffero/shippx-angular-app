import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const shippxRoutes: Routes = [
    {
        path: 'shippx',
        loadComponent: () => import('./main/main').then(m => m.Main),
        children: [
            { path: 'auth', loadChildren: () => import('./inner/authflow/auth.router').then(m => m.AUTH_ROUTES) },

            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
    }
];
