import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type SnackbarType = 'success' | 'error' | 'info';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private snackBar = inject(MatSnackBar)

  show(message: string, type: SnackbarType = "info", duration = 5000){
    this.snackBar.open(message, "OK",{
      duration,
      panelClass: [`snackbar-${type}`],
      horizontalPosition: "center",
      verticalPosition: "top"
    })
  }
}
