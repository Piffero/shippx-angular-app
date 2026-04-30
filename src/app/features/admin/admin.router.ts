import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path: '', 
        loadComponent: () => import('./main/main').then(m => m.Main),
        data: { role: 'ADMIN' },
        children: [
            {path: 'dashboard', loadComponent: () => import('./inner/dashboard/dashboard').then(m => m.Dashboard) },
            {path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
];
