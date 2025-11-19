import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from "./features/components/toolbar/toolbar";
import { Footer } from "./features/components/footer/footer";
import { Spinner } from './shared/components/spinner/spinner';
import { LoaderService } from './shared/services/loader-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toolbar, Footer, Spinner],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})

export class App {
  private loader = inject(LoaderService)

  get loading(): boolean {
    return this.loader.isLoading()
  }
}
