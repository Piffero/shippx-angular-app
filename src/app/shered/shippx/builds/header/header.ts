import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { SupabaseAuthService } from '../../../../core/services/supabase-auth.service';

@Component({
  selector: 'rd-shippx-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  // Observables para o template
  isLoggedIn$!: Observable<boolean>;
  user$!: Observable<{name: string, role: string} | null>;

  private authService = inject(SupabaseAuthService);
  private _router = inject(Router);

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.user$ = combineLatest([this.authService.user$, this.authService.userProfile$]).pipe(
      map(([user, profile]) => {
        if (!user) return null;
        return { 
          name: user.user_metadata['full_name'] || user.email?.split('@')[0] || 'User',
          role: profile?.role || ''
        };
      })
    );
  }

  async logout() {
    await this.authService.signOut();
    this._router.navigate(['/shippx/signin']);
  }

}
