import { computed, Injectable, signal } from '@angular/core';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {
  private counter = signal(0);
  readonly isLoading = computed(() => this.counter() > 0); // Signal<boolean>

  show(): void { this.counter.update(n => n + 1); }
  hide(): void { this.counter.update(n => (n > 0 ? n - 1 : 0)); }
  reset(): void { this.counter.set(0); }

  wrap<T>(obs$: Observable<T>): Observable<T> {
    this.show();
    return obs$.pipe(finalize(() => this.hide()));
  }
}
