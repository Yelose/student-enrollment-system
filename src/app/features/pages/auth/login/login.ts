import { Component, inject } from '@angular/core';
import { FormControl, NonNullableFormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth';
import { SnackBarService } from '../../../../shared/services/snack-bar-service';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';

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
    }

    if (this.loginForm.valid && email && password) {
      this.authService.login(email as string, password as string).subscribe({
        next: () => {
          this.snackbar.show("Se ha iniciado sesión correctamente", "success");
          const redirect = this.router.parseUrl(this.router.url).queryParams?.['redirect'];
          this.router.navigateByUrl(redirect || '/offers');
        },
        error: () => {
          this.snackbar.show("Usuario o contraseña incorrectos", "error");
        }
      });
    }
   }
}
