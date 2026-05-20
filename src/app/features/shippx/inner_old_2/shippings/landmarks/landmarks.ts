import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rd-shippings-landmarks',
  imports: [CommonModule],
  templateUrl: './landmarks.html',
  styleUrl: './landmarks.css',
})
export class Landmarks {
  // Recebe o pacote completo como input
  packageData = input.required<any>();

  // Mapeia os status para ícones e textos amigáveis
  timelineEvents = computed(() => {
    const pkg = this.packageData();
    const events = [];

    // Evento 1: Criação (Sempre existe)
    events.push({
      status: 'Criado',
      title: 'Etiqueta Gerada',
      description: `Pedido sincronizado da plataforma ${pkg.origin_platform}`,
      date: pkg.created_at,
      icon: 'fa-print',
      completed: true
    });

    // Evento 2: Entrada no Hub
    if (pkg.status !== 'READY_TO_POST') {
      events.push({
        status: 'IN_HUB',
        title: 'Recebido no Posto',
        description: `Pacote entregue no ponto: ${pkg.partner_hubs?.name || 'Hub Parceiro'}`,
        date: pkg.updated_at, // Aqui você usaria o campo específico de entrada no hub se tiver
        icon: 'fa-home',
        completed: true
      });
    }

    // Evento 3: Coleta/Trânsito
    if (['COLLECTED', 'IN_TRANSIT', 'ARRIVED_AT_DESTINATION'].includes(pkg.status)) {
      events.push({
        status: 'IN_TRANSIT',
        title: 'Em Trânsito',
        description: 'O motorista coletou o pacote e está em rota de entrega.',
        date: pkg.updated_at,
        icon: 'fa-truck',
        completed: true
      });
    }

    // Evento 4: Entrega Final
    if (pkg.status === 'ARRIVED_AT_DESTINATION') {
      events.push({
        status: 'DELIVERED',
        title: 'Entregue no Destino',
        description: 'Pacote entregue no Centro de Distribuição Final.',
        date: pkg.updated_at,
        icon: 'fa-check-circle-o',
        completed: true
      });
    }

    return events.reverse(); // Mostrar o mais recente no topo
  });
}
