import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'rd-fiscal-cte-generator',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cte-generator.html',
  styleUrl: './cte-generator.css',
})
export class CteGenerator {
  private fb = inject(FormBuilder);

  order = input.required<any>(); // Recebe a ordem correspondente para herdar dados
  onGenerated = output<string>(); // Emite a chave do CT-e gerado
  onCancel = output<void>();

  loading = signal<boolean>(false);
  success = signal<boolean>(false);

  cteForm = this.fb.group({
    rnft: ['12345678', [Validators.required]], // Registo Nacional de Transportadores
    pesoBruto: [0, [Validators.required, Validators.min(0.1)]],
    valorFrete: [0, [Validators.required, Validators.min(0.01)]],
    cfop: ['5352', [Validators.required]] // Prestação de serviço de transporte
  });

  generateCte() {
    if (this.cteForm.invalid) return;

    this.loading.set(true);
    
    // Simula chamada de Edge Function para comunicar com a SEFAZ e assinar o CT-e
    setTimeout(() => {
      this.loading.set(false);
      this.success.set(true);
      
      // Gera uma chave fictícia de CT-e de 44 dígitos para simulação do sucesso
      const mockupCteKey = '3526' + Math.random().toString().slice(2, 16) + '570010000000012' + Math.random().toString().slice(2, 15);
      
      setTimeout(() => {
        this.onGenerated.emit(mockupCteKey);
      }, 1000);
    }, 2000);
  }
}
