import { Component, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../../core/services/authflow/auth.service';


@Component({
  selector: 'rd-rdprofile-invoices',
  imports: [CommonModule],
  templateUrl: './invoices.html',
  styleUrl: './invoices.css',
})
export class Invoices {
  private _auth = inject(AuthService);
  profile = toSignal(this._auth.userProfile$); // Mock ou signal do seu auth

  // Dados fictícios para visualização
  transactions = signal([
    { id: '1', date: new Date(), desc: 'Coleta Hub Padaria Central', type: 'credit', value: 112.50, status: 'paid' },
    { id: '2', date: new Date(), desc: 'Coleta Hub Posto Shell', type: 'credit', value: 45.00, status: 'pending' },
    { id: '3', date: new Date(), desc: 'Assinatura Mensal Pro', type: 'debit', value: 49.99, status: 'paid' },
  ]);

  totalBalance = computed(() => {
    return this.transactions().reduce((acc, t) => t.type === 'credit' ? acc + t.value : acc - t.value, 0);
  });
}
