import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
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

            { path: 'profile', loadChildren: () => import('./inner/user-profile/user-profile.router').then(m => m.userProfileRouter)},
            { path: 'shipping', loadChildren: () => import('./inner/shipping/shipping.router').then(m => m.shippingRoutes) },
            { path: 'opportunities', loadChildren: () => import('./inner/opportunity/opportunity.router').then(m => m.opportunityRoutes) },

            { path: 'dashboard', loadComponent: () => import('./inner/ctrl-panel/main/main').then(m => m.Main), canActivate: [authGuard] },

            //{ path: 'ctracking', loadComponent: () => import('./inner/customer/tracking/tracking').then(m => m.Tracking), canActivate: [authGuard, roleGuard], data: { role: 'CLIENT' } },
            //{ path: 'ttracking', loadComponent: () => import('./inner/transporter/tracking/tracking').then(m => m.Tracking), canActivate: [authGuard, roleGuard], data: { role: 'CARRIER' } },
            { path: '**', redirectTo: '', pathMatch: 'full' }
        ]
    }
];
