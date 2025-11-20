import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { SnackBarService } from '../../shared/services/snack-bar-service';
import { finalize, map, take } from 'rxjs';
import { LoaderService } from '../../shared/services/loader-service';

export const authGuard: CanActivateFn = (_route, state) => {
  const afAuth = inject(Auth);
  const router = inject(Router);
  const snackbar = inject(SnackBarService);
  const loader = inject(LoaderService);

  loader.show();

  return authState(afAuth).pipe(
    take(1),
    map(user => {
      if (user) return true;

      snackbar.show('Debes iniciar sesión para acceder', 'error');

      const url = state.url;
      const extras: { queryParams?: Record<string, string> } = {};

      // Solo añadimos redirect si tiene sentido (no '/' ni '/login')
      if (url && url !== '/' && url !== '/login') {
        extras.queryParams = { redirect: url };
      }

      return router.createUrlTree(['/login'], extras);
    }),
    finalize(() => loader.hide())
  );
};
