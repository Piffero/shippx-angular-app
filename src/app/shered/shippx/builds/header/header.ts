import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { AuthService } from './../../../../core/services/authflow/auth.service'

@Component({
  selector: 'rd-shippx-header',
  imports: [CommonModule, RouterLink, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  private _auth = inject(AuthService);
  private _router = inject(Router);

  // No seu repo, o AuthService geralmente já tem isLoggedIn e userProfile$
  isLoggedIn$!: Observable<boolean>;
  user$!: Observable<{name: string, role: string} | null>;

  ngOnInit(): void {
    // Usando a lógica do seu serviço atual
    this.isLoggedIn$ = this._auth.userProfile$.pipe(map(profile => !!profile));
    
    this.user$ = this._auth.userProfile$.pipe(
      map(profile => {
        if (!profile) return null;
        return {
          name: profile.full_name || 'Usuário',
          role: profile.role || 'CLIENT'
        };
      })
    );
  }

  async logout() {
    await this._auth.signOut();
    this._router.navigate(['/shippx/signin']);
  }

}
