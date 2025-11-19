import { Component, inject } from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { SnackBarService } from '../../../shared/services/snack-bar-service';

@Component({
  selector: 'app-home',
  imports: [MatButton, MatCardModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  longText = `The Shiba Inu is the smallest of the six original and distinct spitz breeds of dog
  from Japan. A small, agile dog that copes very well with mountainous terrain, the Shiba Inu was
  originally bred for hunting.`;

  private snackbar = inject(SnackBarService)

  showSuccess() {
    this.snackbar.show('Operación realizada correctamente', 'success');
  }

  showError() {
    this.snackbar.show('Ha ocurrido un error inesperado', 'error');
  }

  showInfo() {
    this.snackbar.show('Información general', 'info');
  }
}
