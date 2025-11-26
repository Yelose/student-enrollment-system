import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-students-list',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './students-list.html',
  styleUrl: './students-list.scss',
})
export class StudentsList {

}
