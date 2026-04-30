import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const shippxRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./main/main').then(m => m.Main),
        children: [
            
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
    }
];
