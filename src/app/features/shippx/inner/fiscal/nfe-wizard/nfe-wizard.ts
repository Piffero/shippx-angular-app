import { CommonModule } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'rd-fiscal-nfe-wizard',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nfe-wizard.html',
  styleUrl: './nfe-wizard.css',
})
export class NfeWizard {
  private fb = inject(FormBuilder);

  // Inputs e Outputs usando a API moderna do Angular
  orderId = input.required<string>();
  onComplete = output<{ chave: string; numero: string; serie: string }>();
  onCancel = output<void>();

  // Estados do Wizard
  currentStep = signal<number>(1);
  loading = signal<boolean>(false);

  // Form Group Unificado
  fiscalForm = this.fb.group({
    chave: ['', [Validators.required, Validators.minLength(44), Validators.maxLength(44), Validators.pattern('^[0-9]*$')]],
    numero: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    serie: ['1', [Validators.required, Validators.pattern('^[0-9]*$')]],
    icmsSt: [0, [Validators.required, Validators.min(0)]]
  });

  nextStep() {
    if (this.currentStep() === 1 && this.fiscalForm.get('chave')?.invalid) {
      return;
    }
    this.currentStep.update(step => step + 1);
  }

  prevStep() {
    this.currentStep.update(step => step - 1);
  }

  submitFiscal() {
    if (this.fiscalForm.invalid) return;
    
    this.loading.set(true);
    const formValues = this.fiscalForm.value;
    
    // Simula processamento com a SEFAZ
    setTimeout(() => {
      this.loading.set(false);
      this.onComplete.emit({
        chave: formValues.chave!,
        numero: formValues.numero!,
        serie: formValues.serie!
      });
    }, 1500);
  }
  
}
