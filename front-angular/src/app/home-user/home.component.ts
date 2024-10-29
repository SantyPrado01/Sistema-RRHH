import { Component } from '@angular/core';
import { NabvarComponent } from '../nabvar/nabvar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../login/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NabvarComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  username: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername(); // Obtiene el nombre de usuario
  }

}
