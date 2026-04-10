import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ShippingService } from '../../../../../core/services/shippings/shipping.service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { LbPrinting } from '../lb-printing/lb-printing';
import { Landmarks } from '../landmarks/landmarks';
import { Router } from '@angular/router';

@Component({
  selector: 'rd-package-packages',
  imports: [CommonModule, LbPrinting, Landmarks],
  templateUrl: './packages.html',
  styleUrl: './packages.css',
})
export class Packages implements OnInit, OnDestroy {
  private shipmentService = inject(ShippingService);
  private subscription?: RealtimeChannel;
  private _router = inject(Router);

  // Signals para estado reativo local
  allPackages = signal<any[]>([]);
  activeFilter = signal<string>('ALL');
  messageEvent = signal<string>('');
  isLoading = signal<boolean>(false);
  expandedPackageId = signal<string | null>(null);

  // Lógica de filtragem automática (SOLID: Lógica de UI no componente)
  filteredPackages = computed(() => {
    const pkgs = this.allPackages();
    const filter = this.activeFilter();
    return filter === 'ALL' ? pkgs : pkgs.filter(p => p.status === filter);
  });

  async ngOnInit() {
    await this.loadData();
    // inscreve-se para atualizações automáticas (Realtime)
    this.subscription = this.shipmentService.subscribeToPackageUpdates(() => { 
      this.loadData(); // Recarrega quando houver mudança no banco
    });
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      // Limpa erros anteriores antes de tentar carregar
      this.messageEvent.set('');

      const data = await this.shipmentService.getMyPackages();
      if (data?.error) { throw data.error; }
      
      this.allPackages.set(data.data || []);

    } catch (err: any) {    
      const errorMessage = err.message || 'Ocorreu um erro ao carregar os pacotes.';
      this.messageEvent.set(errorMessage);
      console.error('Shipment Load Error:', err);
    } finally {
      this.isLoading = signal<boolean>(false);
    }
  }

  setFilter(status: string) {
    this.activeFilter.set(status);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  // Helpers Visuais
  getStatusLabel(status: string): string {
    const labels: any = {
      'READY_TO_POST': 'Pronto para Envio',
      'IN_HUB': 'No Posto Parceiro',
      'COLLECTED': 'Coletado',
      'IN_TRANSIT': 'Em Trânsito',
      'ARRIVED_AT_DESTINATION': 'Entregue'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'READY_TO_POST': 'bg-secondary-subtle text-secondary border-secondary',
      'IN_HUB': 'bg-warning-subtle text-warning-emphasis border-warning',
      'COLLECTED': 'bg-info-subtle text-info-emphasis border-info',
      'IN_TRANSIT': 'bg-primary-subtle text-primary border-primary',
      'ARRIVED_AT_DESTINATION': 'bg-success-subtle text-success border-success'
    };
    return map[status] || 'bg-light text-dark';
  }

  getProgressWidth(status: string): string {
    const steps: Record<string, string> = {
      'READY_TO_POST': '15%',
      'IN_HUB': '40%',
      'COLLECTED': '65%',
      'IN_TRANSIT': '85%',
      'ARRIVED_AT_DESTINATION': '100%'
    };
    return steps[status] || '0%';
  }

  // Abre a tela de detalhes do pacote
  viewDetails(pkg: any) {
    // Se clicar no que já está aberto, ele fecha. Se não, abre o novo.
    if (this.expandedPackageId() === pkg.id) {
      this.expandedPackageId.set(null);
    } else {
      this.expandedPackageId.set(pkg.id);
    }
  }

  // Dispara a geração da etiqueta (QR Code Shippx)
  printLabel(pkg: any) {
    console.log('Gerando etiqueta para o pacote:', pkg.id);
    
    // Exemplo de lógica inicial: abrir uma nova aba com os dados
    const labelData = {
      id: pkg.id,
      order: pkg.external_order_id,
      platform: pkg.origin_platform,
      hub: pkg.partner_hubs?.name
    };
    this.messageEvent.set(`Gerando etiqueta para Pedido ${labelData.order}. \nEm breve: Integração com PDFMake.`);
  }
}
