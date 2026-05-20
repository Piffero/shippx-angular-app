import { Component, HostListener, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../../../core/services/supabase/supabase.service';
import { ProfileService } from '../../../../../../core/services/database/profile.service';
import { passwordMatchValidator } from '../../../../../../core/interceptors/password-match.validator';

@Component({
  selector: 'rd-authflow-signup',
  imports: [ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class SignUp {
  private fb = inject(FormBuilder);
  private _client = inject(SupabaseService).client;
  private _pService = inject(ProfileService);

  signUpForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    full_name: ['', Validators.required],
    document: ['', Validators.required], // CPF ou CNPJ
    type_account: ['trade', Validators.required], // 'supplier' | 'trade' | 'carrier'
    trade_type: ['importer', Validators.required] // 'own_store' | 'industry | 'personal' | 'business' | 'private' | 'logistics'  
  }, { validators: passwordMatchValidator });

  loading = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');

  selectedAccountType: 'supplier' | 'trade' | 'carrier' = 'trade';
  openedHelp = signal<string | null>(null);
  
  toggleHelp(id: string) {
    this.openedHelp.update(current => current === id ? null : id);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('help-tooltip')) {
      this.openedHelp.set(null);
    }
  }

  async handleSignUp() {
    if (this.signUpForm.invalid) return;
    const { email, password, confirmPassword, full_name, document, type_account, trade_type } = this.signUpForm.value;

    this.loading.set(true);
    // Criar usuário no Auth do Supabase
    const { data, error } = await this._client.auth.signUp({
      email: email!,
      password: password!,
    });

    if (error) {
      this.errorMessage.set(error.message);
      this.loading.set(false);
      return;
    }

    // Criar perfil no banco de dados
    if (data?.user) {
        const { error: profileError } = await this._pService.updateProfile({
        id: data.user?.id,
        full_name: full_name!,
        document: document!,
        type_account: type_account as 'supplier' | 'trade' | 'carrier',
        trade_type: trade_type as 'own_store' | 'industry' | 'personal' | 'business' | 'private' | 'logistics',
        role: 'owner'
      });

      if (profileError) {
        this.errorMessage.set(profileError.message);
        this.loading.set(false);
        return;
      }

      this.loading.set(false);
      return;
    }
    
    this.errorMessage.set('Ocorreu um erro desconhecido. Por favor, tente novamente.');
    this.loading.set(false);
  }
}
