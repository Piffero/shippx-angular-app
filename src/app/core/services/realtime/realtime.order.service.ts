import { Injectable } from '@angular/core';
import { RealtimeService } from './realtime.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RealtimeOrderService extends RealtimeService {
  // Escuta especificamente mudanças em pedidos para o Dashboard
  watchOrders(orderId: string) {
    return this.getTableStream('orders', 'UPDATE').pipe(
      map((payload) => payload.new),
      map((order) => (order.id === orderId ? order : null)) // Filtra apenas o pedido que o usuário está visualizando
    );
  }

  // Rastreamento do GPS para o Bar ver o Motorista em Florianópolis [cite: 25, 28]
  watchDriverLocation(orderId: string) {
    return this.getTableStream('deliveries', 'UPDATE', orderId).pipe(
      map((payload) => ({
        lat: payload.new.current_lat,
        lng: payload.new.current_lng,
      }))
    );
  }
}
