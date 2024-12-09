import { Component } from '@angular/core';
import { NavbarComponent } from '../nabvar/navbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manual',
  standalone: true,
  imports: [NavbarComponent, RouterModule],
  templateUrl: './manual.component.html',
  styleUrl: './manual.component.css'
})
export class ManualComponent {

  selectedSection: string | null = null;

  scrollToSection(sectionId: string): void {
    this.selectedSection = sectionId;

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
