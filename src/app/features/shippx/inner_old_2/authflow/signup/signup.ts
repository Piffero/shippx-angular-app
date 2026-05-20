import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, Signal, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../../../environments/environment';

declare var bootstrap: any;

@Component({
  selector: 'rd-shippx-signup',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {

  private fb = inject(FormBuilder);
  private _router = inject(Router);
  private supabase: SupabaseClient = createClient(environment.supabaseUrl, environment.supabaseKey);

  loading = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');

  selectedRole: 'CLIENT' | 'CARRIER' | 'BROKER' = 'CLIENT';

  signUpForm = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    role: ['CLIENT', Validators.required],
  });
  
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
  }

}
