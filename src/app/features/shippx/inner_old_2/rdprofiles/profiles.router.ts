import { Routes } from '@angular/router';

export const profileRouter: Routes = [
    { path: '', loadComponent: () => import('./ctrl-main/ctrl-main').then(m => m.CtrlMain) }
];