import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../../../core/services/supabase/supabase.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'rd-authflow-signin',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './signin.html',
  styleUrl: './signin.css',
})
export class SignIn implements OnInit {
  private fb = inject(FormBuilder);
  private _client = inject(SupabaseService).client;
  private _router = inject(Router);

  private readonly REMEMBER_KEY = 'shippx_remember_email';

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    remember: [false]
  });

  loading = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  errorMessage = signal('');

  ngOnInit() {
    this.checkRememberedEmail();
  }

  private checkRememberedEmail() {
    const savedEmail = localStorage.getItem(this.REMEMBER_KEY);
    if (savedEmail) {
      this.authForm.patchValue({
        email: savedEmail,
        remember: true
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  async handleLogin() {
    if (this.authForm.invalid) return;

    this.loading.set(true);
    this.errorMessage.set('');

    const { email, password, remember } = this.authForm.value;
    const { error } = await this._client.auth.signInWithPassword({
      email: email!,
      password: password!
    });

    if (error) {
      this.errorMessage.set(`Acesso negado. Verifique suas credenciais. ${error.message}`);
      this.loading.set(false);
    }

    // Lógica do Remember Me
    if (remember) {
      localStorage.setItem(this.REMEMBER_KEY, email!);
    } else {
      localStorage.removeItem(this.REMEMBER_KEY);
    }

    this._router.navigate(['/shippx']);
  }
}
