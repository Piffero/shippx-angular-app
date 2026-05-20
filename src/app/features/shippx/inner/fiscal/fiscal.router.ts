import { Routes } from "@angular/router";
import { FiscalComponent } from "./fiscal.component";

export const FISCAL_ROUTES: Routes = [
  {
    path: '',
    component: FiscalComponent,
    children: [
      { path: 'dashboard-supplier', loadComponent: () => import('./dashboard/dashboard-supplier/dashboard-supplier').then(c => c.DashboardSupplier) },
      { path: 'dashboard-trade', loadComponent: () => import('./dashboard/dashboard-trade/dashboard-trade').then(c => c.DashboardTrade) },
      { path: 'dashboard-carrier', loadComponent: () => import('./dashboard/dashboard-carrier/dashboard-carrier').then(c => c.DashboardCarrier) },
    ]
  }
];