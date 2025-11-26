import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Auth,
  authState,
  signInWithEmailAndPassword,
  User,
} from '@angular/fire/auth';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = inject(Auth);

  private userSignal = toSignal<User | null>(authState(this.auth), {
    initialValue: null,
  });

  readonly currentUser = computed(() => this.userSignal());
  readonly isLoggedIn = computed(() => !!this.userSignal());

  get user(): User | null {
    return this.userSignal();
  }

  login(email: string, password: string) {
    // devolvemos directamente el observable, sin loader
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(this.auth.signOut());
  }
}
