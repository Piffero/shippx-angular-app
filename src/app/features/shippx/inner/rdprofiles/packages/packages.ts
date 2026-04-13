import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../../core/services/authflow/auth.service';

@Component({
  selector: 'rd-rdprofiles-packages',
  imports: [CommonModule],
  templateUrl: './packages.html',
  styleUrl: './packages.css',
})
export class Packages {
  private _auth = inject(AuthService);
  
  // Usando a mesma lógica de conversão para Signal que aplicamos no CtrlMain
  private _rawProfile = toSignal(this._auth.userProfile$, { initialValue: null });

  profile = computed(() => {
    const p = this._rawProfile();
    if (!p) return null;
    return {
      ...p,
      role: p.role as 'CLIENT' | 'BROKER' | 'CARRIER' | 'ADMIN'
    };
  });

  isPro = computed(() => !!this.profile()?.is_pro); // Supondo que exista 'is_pro' no model

  subscribe() {
    console.log('Iniciando checkout de R$ 49,99...');
    // Aqui entrará a integração com Stripe ou Mercado Pago
  }
}
