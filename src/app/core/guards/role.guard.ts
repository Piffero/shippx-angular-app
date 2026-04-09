import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { map, take } from 'rxjs';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(SupabaseAuthService);
  const router = inject(Router);
  const expectedRole = route.data['role']; // Pegamos o role definido na rota

  return authService.userProfile$.pipe(
    take(1),
    map(profile => {
      if (profile && profile.role === expectedRole) {
        return true;
      }
      
      // Se não tiver o role certo, manda para a home ou login
      return router.createUrlTree(['/']); 
    })
  );
};