import { Routes } from '@angular/router';
import { authGuard } from '../../../../core/guards/auth.guard';
import { roleGuard } from '../../../../core/guards/role.guard';

export const ShippingsRouter: Routes = [
    { path: '', loadComponent: () => import('./packages/packages').then(m => m.Packages) },
    { path: 'printing', loadComponent: () => import('./lb-printing/lb-printing').then(m => m.LbPrinting), canActivate: [authGuard, roleGuard], data: { role: 'BROKER' } },
    { path: 'hubs-map', loadComponent: () => import('./hubs-map/hubs-map').then(m => m.HubsMap), canActivate: [authGuard, roleGuard], data: {role: 'ADMIN'} },
    { path: 'landmarks',loadComponent: () => import('./landmarks/landmarks').then(m => m.Landmarks), canActivate: [authGuard, roleGuard], data: {role: 'BROKER'} }
];