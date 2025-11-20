import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { SnackBarService } from '../../../../shared/services/snack-bar-service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [MatInputModule, MatFormFieldModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
   private fb = inject(NonNullableFormBuilder)
   private authService = inject(AuthService)
   private router = inject(Router)
   private route =  inject(ActivatedRoute)
   private snackbar = inject(SnackBarService)

   loginForm = this.fb.group({
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required)
   })

   get email() {
    return this.loginForm.get("email")
   }

   get password() {
    return this.loginForm.get("password")
   }

   submit(){
    const {email, password} = this.loginForm.value
    
    if (!this.loginForm.valid || !email || !password){
      this.snackbar.show("Formulario incorrecto", "error")
      return
    }

    this.authService.login(email, password).subscribe({
      next: () => {
        this.snackbar.show('Se ha iniciado sesión correctamente', 'success');

        // leer redirect de los query params del login
        const redirect = this.route.snapshot.queryParamMap.get('redirect');

        // si no hay redirect -> ir a home raíz
        this.router.navigateByUrl(redirect || '/');
      },
      error: () => {
        this.snackbar.show('Usuario o contraseña incorrectos', 'error');
      },
    });    
   }
}
