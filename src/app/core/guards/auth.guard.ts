import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(SupabaseAuthService);
  const router = inject(Router);

  return authService.isLoggedIn.pipe(
    take(1),
    map(isLoggedIn => {
      if (isLoggedIn) return true;
      return router.createUrlTree(['/auth/signin'], { queryParams: { returnUrl: state.url } });
    })
  );
};