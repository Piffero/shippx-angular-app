import { Routes } from '@angular/router';
import { authGuard } from '../../../../core/guards/auth.guard';
import { roleGuard } from '../../../../core/guards/role.guard';

export const ShippingsRouter: Routes = [
    { path: '', loadComponent: () => import('./packages/packages').then(m => m.Packages) },
    { path: 'printing', loadComponent: () => import('./lb-printing/lb-printing').then(m => m.LbPrinting), canActivate: [authGuard, roleGuard], data: { role: 'BROKER' } }
];