import { Component } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [NabvarComponent],
  templateUrl: './empleados-list.component.html',
  styleUrl: './empleados-list.component.css'
})
export class EmpleadosListComponent {

}
