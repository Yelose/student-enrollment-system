import { inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { CanActivateFn, Router } from '@angular/router';
import { SnackBarService } from '../../shared/services/snack-bar-service';
import { LoaderService } from '../../shared/services/loader-service';
import { take, map, finalize } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth)
  const router = inject(Router)
  const snackbar = inject(SnackBarService)
  const loader = inject(LoaderService)

  loader.show()
  
  
  
  return authState(auth).pipe(
    take(1), // espera a que Firebase resuelva la sesión
    map(user => {
      if (user) return true;
      snackbar.show("Debes iniciar sesión para acceder", "error")
      return router.createUrlTree(["/login"], {queryParams: {redirect: state.url}})
    }),
  finalize(() => loader.hide())
  );
};
