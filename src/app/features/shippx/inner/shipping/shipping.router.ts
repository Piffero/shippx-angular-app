import { Routes } from '@angular/router';

export const shippingRoutes: Routes = [
    { path: '', loadComponent: () => import('./category/category').then(m => m.Category) },
    { path: 'subcategory/:catId', loadComponent: () => import('./subcategory/subcategory').then(m => m.Subcategory) },
    { path: 'create/:catId/:subId', loadComponent: () => import('./forms/step-one/step-one').then(m => m.StepOne) },
    { path: 'confirm', loadComponent: () => import('./forms/step-two/step-two').then(m => m.StepTwo) },
]