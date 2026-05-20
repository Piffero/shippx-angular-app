import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../../core/services/authflow/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'rd-shippx-forgot',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forgot.html',
  styleUrl: './forgot.css',
})
export class Forgot {
  private _authService = inject(AuthService);
  private _router = inject(Router);

  // Passos: 'EMAIL' | 'CODE' | 'PASSWORD' = 'EMAIL';
  currentStep = signal<'EMAIL' | 'CODE' | 'PASSWORD'>('EMAIL');

  email = signal('');
  newPassword = signal('');
  confirmPassword = signal('');
  verificationCode = signal('');
  
  loading = signal(false);
  errorMessage = signal('');

  resendTimer = signal(0);
  loadingResend = signal(false);

  startResendTimer() {
    this.resendTimer.set(60); // 60 segundos de espera
    const interval = setInterval(() => {
      this.resendTimer.update(v => v - 1);
      if (this.resendTimer() <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }

  async resendCode() {
    if (this.resendTimer() > 0 || this.loadingResend()) return;

    this.loadingResend.set(true);
    const { error } = await this._authService.resetPasswordForEmail(this.email());
    
    if (!error) {
      this.startResendTimer();
      // Aqui você pode disparar um Toast de "E-mail reenviado!"
    }
    this.loadingResend.set(false);
  }

  async sendResetCode() {
    const emailValue = this.email();
    if (!emailValue) { this.errorMessage.set('Por favor, insira um e-mail válido.'); return; }
    
    this.loading.set(true);
    this.errorMessage.set('');
    
    try {
      const { data, error } = await this._authService.resetPasswordForEmail(emailValue);
      if (!error) {
        this.currentStep.set('CODE');
      }
    } catch (error) {
      this.errorMessage.set('Erro ao enviar código de redefinição de senha.');
    } finally {
      this.loading.set(false);
    }
  }

  async verifyCode() {
    const code = this.verificationCode();
    const email = this.email();

    if (code.length !== 6) { this.errorMessage.set('O código deve conter 6 dígitos.'); return; }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const { data, error } = await this._authService.verifyOtp(email, code, 'recovery');
      if (error) {
        this.errorMessage.set('Código inválido ou expirado. Tente novamente.'); return;
      }

      this.currentStep.set('PASSWORD');
    } catch (err) {
      this.errorMessage.set('Erro ao verificar código.'); return;
    } finally {
      this.loading.set(false);
    }
  }

  async resetPassword() {
    const newPasswordValue = this.newPassword();
    const confirmPasswordValue = this.confirmPassword();

    if (newPasswordValue.length < 6) { this.errorMessage.set('A senha deve conter pelo menos 6 caracteres.'); return; }
    if (newPasswordValue !== confirmPasswordValue) { this.errorMessage.set('As senhas não coincidem.'); return; }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const { data, error } = await this._authService.updateUserPassword(newPasswordValue);
      if (error) {
        this.errorMessage.set('Erro ao atualizar senha.'); return;
      }
      this._router.navigate(['/shippx/signin']);
    } catch (err) {
      this.errorMessage.set('Erro ao atualizar senha.'); return;
    } finally {
      this.loading.set(false);
    }
  }

}
