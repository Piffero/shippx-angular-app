import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../../core/services/authflow/auth.service';
import { PaymentService } from '../../../../../core/services/Payments/payment.service';

@Component({
  selector: 'rd-rdprofiles-packages',
  imports: [CommonModule],
  templateUrl: './packages.html',
  styleUrl: './packages.css',
})
export class Packages {
  private _auth = inject(AuthService);
  private _payment = inject(PaymentService);
  
  // Usando a mesma lógica de conversão para Signal que aplicamos no CtrlMain
  private _rawProfile = toSignal(this._auth.userProfile$, { initialValue: null });
  qrCodeData = signal<{ brCode: string, qrCodeImage: string } | null>(null);
  loading = signal(false);

  profile = computed(() => {
    const p = this._rawProfile();
    if (!p) return null;
    return {
      ...p,
      role: p.role as 'CLIENT' | 'BROKER' | 'CARRIER' | 'ADMIN'
    };
  });

  isPro = computed(() => !!this.profile()?.is_pro); // Supondo que exista 'is_pro' no model

  async subscribe(subscriptionMode: 'DELIVERY_CREDIT' | 'PRO_SUBSCRIPTION' = 'PRO_SUBSCRIPTION') {
    try {
     this.loading.set(true);
     // 1. chama o Cloud Function via Service
     const response = await this._payment.createPixChange(subscriptionMode);

     // 2. Armazena os dados do PIX (ajuste conforme o retorno da OpenPIX)
     if (response && response.charge) {
      this.qrCodeData.set({
        brCode: response.charge.brCode,
        qrCodeImage: response.change.qrCodeImage
      });
     }
    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
    } finally {
      this.loading.set(false);
    }
  }

  copyBrCode() {
    if (this.qrCodeData()) {
      navigator.clipboard.writeText(this.qrCodeData()!.brCode);
      // Aqui você pode disparar um toast de "Copiado!"
    }
  }
}
