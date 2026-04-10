import { Component, OnInit, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router'
import { ShippingService } from '../../../../../core/services/shipping.service';
import { SupabaseAuthService } from '../../../../../core/services/supabase-auth.service';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'rd-opportunity-form',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './form.html',
  styleUrl: './form.css',
})
export class Form implements OnInit, OnDestroy {
  private _route = inject(ActivatedRoute);
  private _shipping = inject(ShippingService);
  private _auth = inject(SupabaseAuthService);
  private _supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  // Estados Reativos
  shipment = signal<any>(null);
  quotes = signal<any[]>([]);
  questions = signal<any[]>([]);
  loading = signal(true);

  // User context
  currentUser = this._auth.currentProfileValue;
  isOwner = computed(() => this.shipment()?.user_id === this.currentUser?.id);
  isCarrier = computed(() => this.currentUser?.role === 'CARRIER' || this.currentUser?.role === 'ADMIN');

  newQuote = { amount: null, pickup_days: 6, delivery_days: 6, transport_mode: 'Rodoviário', transport_type: 'Aberto', payment: 'Retirada', payment_mode: 'PIX'  };
  newQuestion = signal('');
  showQuoteDetails = signal<string | null>(null);
  messageEvent = signal('');
  messageCss = signal('alert-danger');

  // Signal para armazenar a contagem em tempo real
  viewerCount = signal(0);
  private presenceChannel: any;

  async ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');
    if (id) { 
      this.setupPresence(id);
      await this.loadData(id); 
    }
  }

  ngOnDestroy() {
    // Importante: Sair do canal ao destruir o componente
    if (this.presenceChannel) {
      this.presenceChannel.unsubscribe();
    }
  }

  setupPresence(shipmentId: string) {
    this.presenceChannel = this._supabase.channel(`shipment_watchers_${shipmentId}`, {
      config: { presence: { key: this.currentUser?.id || 'anon-' + Math.random() } }
    });

    this.presenceChannel
      .on('presence', { event: 'sync' }, () => {
        // Quando a lista de presença sincroniza, contamos os estados únicos
        const state = this.presenceChannel.presenceState();
        this.viewerCount.set(Object.keys(state).length);
      })
      .subscribe(async (status: string) => {
        if (status === 'SUBSCRIBED') {
          // Envia o status do usuário atual para o canal
          await this.presenceChannel.track({
            online_at: new Date().toISOString(),
          });
        }
      });
  }

  toggleQuoteDetails(quoteId: string) {
    if (this.showQuoteDetails() === quoteId) {
      this.showQuoteDetails.set(null);
    } else {
      this.showQuoteDetails.set(quoteId);
    }
  }

  async loadData(id: string) {
    this.loading.set(true);
    
    // 1. Carregamos primeiro a remessa para saber quem é o dono
    const sRes = await this._shipping.getShipmentById(id);
    this.shipment.set(sRes.data);

    // 2. Definimos se o usuário logado é o proprietário da carga
    const isOwnerOfShipment = sRes.data?.user_id === this.currentUser?.id;

    // 3. Buscamos as cotações e perguntas em paralelo
    const [qRes, questRes] = await Promise.all([
      isOwnerOfShipment 
        ? this._shipping.getQuotesForOwner(id)  // Carrega dados completos + transportador
        : this._shipping.getQuotesForPublic(id), // Carrega apenas dados básicos
      this._shipping.getQuestsForPublic(id),
    ]);

    this.quotes.set(qRes.data || []);
    this.questions.set(questRes.data || []);
    this.loading.set(false);
  }

  async submitBid() {
    if (!this.currentUser) { this.messageEvent.set('Faça login para enviar um orçamento'); return }

    const bidData = {
      shipment_id: this.shipment().id,
      carrier_id: this.currentUser.id,
      amount: this.newQuote.amount,
      pickup_window: `Em até ${this.newQuote.pickup_days} dias após a reserva`,
      delivery_window: `Em até ${this.newQuote.delivery_days} dias após a coleta`,
      vehicle_type: 'Reboque aberto',
      payment_method: this.newQuote.payment,
      payment_type: this.newQuote.payment_mode
    }

    const { data, error } = await this._shipping.insertQuote(bidData);
    if (!error) { 
      this.messageCss.set('alert-success');
      this.messageEvent.set('Orçamento enviado com sucesso!');
      this.loadData(this.shipment().id);
    } else {
      this.messageCss.set('alert-danger');
      this.messageEvent.set(error.message);      
    }

    setTimeout(() => {
        this.messageEvent.set('');
      }, 3000);
  }

  async sendQuestion() {
    if (!this.newQuestion()) return;
    const { data, error } = await this._shipping.insertQuestion(this.shipment().id, this.newQuestion());
    if (!error) {
      this.newQuestion.set('');
      this.loadData(this.shipment().id);
    }
  }
}
