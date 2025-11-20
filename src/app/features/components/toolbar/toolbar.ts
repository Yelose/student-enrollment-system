import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { SnackBarService } from '../../../shared/services/snack-bar-service';
import { LoaderService } from '../../../shared/services/loader-service';

@Component({
  selector: 'app-toolbar',
  imports: [ MatToolbarModule, RouterLink, MatButtonModule ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})

export class Toolbar {
  private authService = inject(AuthService)
  private snackbar = inject(SnackBarService)
  private router = inject(Router)
  private loader = inject(LoaderService)

  get loading(): boolean{
    return this.loader.isLoading()
  }

  readonly loggedIn = computed(() => !!this.authService.currentUser())
  
  
  logout() {

    this.authService.logout().subscribe({
      next: () => {
        this.snackbar.show('Sesión cerrada correctamente', 'success')
        this.router.navigate(["/login"])
      },
      error: (err) => {
        console.error('Error al cerrar sesión', err);
        this.snackbar.show('No se pudo cerrar la sesión', 'error');
      },
    });
  }
  
}
