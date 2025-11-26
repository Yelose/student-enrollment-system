import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private counter = signal(0);

  // Signal<boolean> - ojo: esto es una función que devuelve boolean
  readonly isLoading = computed(() => this.counter() > 0);

  show(): void {
    this.counter.update((n) => n + 1);
  }

  hide(): void {
    this.counter.update((n) => (n > 0 ? n - 1 : 0));
  }

  reset(): void {
    this.counter.set(0);
  }
}
