import { Component } from '@angular/core';
import { NabvarComponent } from '../nabvar/nabvar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [NabvarComponent, CommonModule],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent {

}
