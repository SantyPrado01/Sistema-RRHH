import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nabvar',
  standalone: true,
  imports:[RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './nabvar.component.html',
  styleUrl: './nabvar.component.css'
  
})
export class NabvarComponent {

}
