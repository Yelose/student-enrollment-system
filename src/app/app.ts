import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toolbar } from "./features/components/toolbar/toolbar";
import { Footer } from "./features/components/footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toolbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})

export class App {
}
