import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../login/auth/auth.service';

@Component({
  selector: 'app-nabvar',
  standalone: true,
  imports:[RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './nabvar.component.html',
  styleUrl: './nabvar.component.css'
  
})
export class NabvarComponent {
  username: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername(); // Obtiene el nombre de usuario
  }

  onLogout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authService.logout();
    }
  }
}
