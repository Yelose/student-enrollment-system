import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  imports: [ MatToolbarModule, RouterLink ],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})

export class Toolbar {

}
