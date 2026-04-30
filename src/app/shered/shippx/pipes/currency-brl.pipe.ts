import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyBrl',
  standalone: true
})
export class CurrencyBrlPipe implements PipeTransform {

  /**
   * Transforma um número em uma string formatada como Moeda Brasileira (R$)
   * Exemplo: 50 -> R$ 50,00
   */
  transform(value: number | string | null | undefined): string {
    if (value === null || value === undefined) {
      return 'R$ 0,00';
    }

    const amount = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(amount)) {
      return 'R$ 0,00';
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  }
}