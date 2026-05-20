import { Routes } from '@angular/router';
import { DeliveryComponent } from './delivery.componet';

export const DELIVERY_ROUTES: Routes = [
    {
        path: '',
        component: DeliveryComponent,
        title: 'Delivery | ShippX',
        children: [
            {
                path: 'opportunities',
                loadComponent: () => import('./map-opportunities/map-opportunities').then(c => c.MapOpportunities),
                title: 'Oportunidades de Frete'
            },
            {
                path: 'tracking/:orderId',
                loadComponent: () => import('./tracking/tracking').then(c => c.Tracking),
                title: 'Em Trânsito'
            },
            {
                path: 'proof/:orderId',
                loadComponent: () => import('./delivery-proof/delivery-proof').then(c => c.DeliveryProof),
                title: 'Finalizar Entrega'
            },
            { path: '', redirectTo: 'opportunities', pathMatch: 'full' }
        ]
    }
];