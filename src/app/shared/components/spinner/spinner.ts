import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner',
  imports: [MatProgressSpinnerModule],
  template: `<mat-spinner/>`,
  styles: `
  :host {
    height: 100dvh;
    width: 100dvw;
    margin: auto;
  }
  `,
})
export class Spinner {

}
