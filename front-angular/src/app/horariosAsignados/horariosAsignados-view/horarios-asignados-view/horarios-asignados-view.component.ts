import { Component } from '@angular/core';
import { NavbarComponent } from '../../../nabvar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-horarios-asignados-view',
  standalone: true,
  imports: [NavbarComponent, MatIconModule, RouterModule],
  templateUrl: './horarios-asignados-view.component.html',
  styleUrl: './horarios-asignados-view.component.css'
})
export class HorariosAsignadosViewComponent {

}
