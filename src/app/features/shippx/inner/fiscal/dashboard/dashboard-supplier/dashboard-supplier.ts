import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../../../../../../core/services/database/orders.service';
import { Order } from '../../../../../../core/models/shippx/order.model';
import { NfeWizard } from '../../nfe-wizard/nfe-wizard';

@Component({
  selector: 'rd-fiscal-dashboard-supplier',
  imports: [CommonModule, FormsModule, NfeWizard],
  templateUrl: './dashboard-supplier.html',
  styleUrl: './dashboard-supplier.css',
})
export class DashboardSupplier implements OnInit {

  private _oService = inject(OrdersService);

  // Signals para estados do Dashboard
  pendingNfeOrders = signal<Order[]>([]); // Pedidos pagos que precisam de NF-e
  recentIssuedOrders = signal<Order[]>([]); // Últimos pedidos com nota emitida
  loading = signal(true);

  // KPI Signals
  totalTaxLiability = signal(0); // Simulação de ICMS-ST acumulado no mês
  activeWizardOrderId = signal<string | null>(null);

  ngOnInit() {
    this.loadFiscalData();
  }

  openWizardForOrder(orderId: string) {
    this.activeWizardOrderId.set(orderId);
  }

  async loadFiscalData() {
    this.loading.set(true);
    try {
      // Busca pedidos que já foram pagos mas ainda não têm chave de NF-e
      const pending = await this._oService.listOrdersByStatus('confirmado');
      this.pendingNfeOrders.set(pending.filter(o => !o.nf_e_chave));

      // Busca pedidos já liberados para transporte
      const issued = await this._oService.listOrdersByStatus('aguardando_motorista');
      this.recentIssuedOrders.set(issued.slice(0, 5));
      
      this.calculateMonthlyTaxes(issued);
    } catch (error) {
      console.error('Erro ao carregar dados fiscais:', error);
    } finally {
      this.loading.set(false);
    }
  }

  // Simulação de cálculo de impostos para o Dashboard
  private calculateMonthlyTaxes(orders: Order[]) {
    const total = orders.reduce((acc, curr) => acc + (curr.valor_total * 0.18), 0); // Ex: 18% ICMS
    this.totalTaxLiability.set(total);
  }

  async linkNfe(orderId: string, chave: string) {
    if (chave.length !== 44) return alert('Chave de NF-e inválida');
    
    try {
      // Atualiza a ordem com a chave e muda o status para liberar para o motorista
      await this._oService.updateOrderNfe(orderId, {
        nf_e_chave: chave,
        status: 'aguardando_motorista'
      });
      // Refresh nos dados
      await this.loadFiscalData();
    } catch (error) {
      alert('Erro ao vincular nota fiscal.');
    }
  }

  async handleWizardSuccess(event: { chave: string; numero: string; serie: string }) {
    const orderId = this.activeWizardOrderId();
    if (!orderId) return;

    try {
      // Envia os dados estruturados para o Supabase e atualiza o status do pedido
      await this._oService.updateOrderNfe(orderId, {
        nf_e_chave: event.chave,
        status: 'aguardando_motorista' // Passaporte liberado para o entregador
      });

      // Fecha o Wizard e recarrega as listas do painel
      this.activeWizardOrderId.set(null);
      await this.loadFiscalData();
    } catch (error) {
      console.error('Erro ao salvar NF-e vinda do Wizard:', error);
      alert('Erro ao finalizar o vínculo da Nota Fiscal.');
    }
  }
  
}
