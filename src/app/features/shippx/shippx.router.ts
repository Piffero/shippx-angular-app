import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const shippxRoutes: Routes = [
    {
        path: '',
        loadComponent: () => import('./main/main').then(m => m.Main),
        children: [
            { path: '', loadComponent: () => import('./inner/xlanding/landing').then(m => m.Landing) },
            { path: 'signin', loadComponent: () => import('./inner/authflow/signin/signin').then(m => m.Signin) },
            { path: 'signup', loadComponent: () => import('./inner/authflow/signup/signup').then(m => m.Signup) },
            { path: 'forgot', loadComponent: () => import('./inner/authflow/forgot/forgot').then(m => m.Forgot) },

            { path: 'packages', loadChildren: () => import('./inner/shippings/shippings.router'). then(m => m.ShippingsRouter)},
            { path: 'opportunities', loadChildren: () => import('./inner/opportun/opportun.router').then(m => m.opportunRouter)},
    
            { path: 'dashboard', loadChildren: () => import('./inner/rdprofiles/profiles.router').then(m => m.profileRouter), canActivate: [authGuard] },
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
    }
];
