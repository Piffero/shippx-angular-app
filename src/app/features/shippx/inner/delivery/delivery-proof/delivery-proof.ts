import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SignaturePad } from '../signature-pad/signature-pad';
import { DeliveryService } from '../../../../../core/services/database/delivery.service';

@Component({
  selector: 'rd-delivery-proof',
  imports: [CommonModule, SignaturePad],
  templateUrl: './delivery-proof.html',
  styleUrl: './delivery-proof.css',
})
export class DeliveryProof implements OnInit {
  private _route = inject(ActivatedRoute);
  private _router = inject(Router);
  private _dService = inject(DeliveryService);

  // Controle de Estado do Fluxo
  orderId = signal<string | null>(null);
  currentStep = signal<'photo' | 'signature' | 'syncing'>('photo');

  // Dados capturados para persistência temporária
  capturedPhoto = signal<File | null>(null);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.orderId.set(this._route.snapshot.paramMap.get('orderId'));
    if (!this.orderId()) {
      this._router.navigate(['/delivery/opportunities']);
    }
  }
  // Captura e Upload da Foto
  async handlePhotoCapture(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      // Faz o upload imediato da foto para o Storage para garantir o dado
      await this._dService.uploadDeliveryPhoto(Number(this.orderId()), file);
      this.capturedPhoto.set(file);
      this.currentStep.set('signature'); // Avança se o upload for OK
    } catch (error) {
      this.errorMessage.set('Erro ao enviar a foto. Tente novamente.');
    } finally {
      this.loading.set(false);
    }
  }
  // Captura da Assinatura e Finalização Total
  async onSignatureConfirmed(signatureFile: File) {
    if (!this.orderId()) return;

    this.loading.set(true);
    this.errorMessage.set(null);
    try {
      // Sobe a assinatura para o Storage
      const sigUrl = await this._dService.uploadDeliverySignature(Number(this.orderId()!), signatureFile);
      // Atualiza os status no banco (RLS garante a segurança)
      // Isso muda a ordem para 'entregue' e a entrega para 'concluida'
      await this._dService.finalizeDelivery(Number(this.orderId()!), {
        signature_url: sigUrl,
        delivered_at: new Date().toISOString(),
        status: 'entregue'
      });
      // Redireciona para o sucesso ou dashboard
      this._router.navigate(['/delivery/opportunities'], { queryParams: { success: true } });
    } catch (error) {
      this.errorMessage.set("Erro ao finalizar entrega. A assinatura foi salva, tentando reenviar...");
      this.currentStep.set('signature'); // Permite tentar novamente a finalização, mantendo a assinatura salva
    } finally {
      this.loading.set(false);
    }
  }
}
