import { Component, HostListener } from '@angular/core';
import { AuthService } from '../login/auth/auth.service';   
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports:[RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isEmployeesOpen = false;
  isCompaniesOpen = false;
  isOrdersOpen = false;
  isBillingOpen = false;
  isUserOpen = false;

  username: string | null = '';

  constructor(private authService: AuthService ) {document.addEventListener('click', this.handleClickOutside.bind(this));}

  ngOnInit(): void {
    this.username = this.authService.getUsername(); // Asignar el nombre de usuario
  }

  // Función para abrir o cerrar los dropdowns
  toggleDropdown(menu: string, event: MouseEvent) {
    event.preventDefault(); // Previene el comportamiento por defecto del enlace
  
    // Reinicia todos los dropdowns, excepto el que se está alternando
    this.isEmployeesOpen = menu === 'employees' ? !this.isEmployeesOpen : false;
    this.isCompaniesOpen = menu === 'companies' ? !this.isCompaniesOpen : false;
    this.isOrdersOpen = menu === 'orders' ? !this.isOrdersOpen : false;
    this.isBillingOpen = menu === 'billing' ? !this.isBillingOpen : false;
    this.isUserOpen = menu === 'user' ? !this.isUserOpen : false;
  }

  closeAllDropdowns(): void {
    this.isEmployeesOpen = false;
    this.isCompaniesOpen = false;
    this.isOrdersOpen = false;
    this.isBillingOpen = false;
    this.isUserOpen = false;
  }

  handleClickOutside(event: MouseEvent) {
    const navbar = document.querySelector('.navbar'); // Selecciona la navbar
    if (!navbar?.contains(event.target as Node)) {
      // Si el clic ocurre fuera de la navbar, cierra todos los dropdowns
      this.isEmployeesOpen = false;
      this.isCompaniesOpen = false;
      this.isOrdersOpen = false;
      this.isBillingOpen = false;
      this.isUserOpen = false;
    }
  }
  ngOnDestroy() {
    // Elimina el listener cuando el componente se destruye
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  // Método para cerrar sesión
  onLogout(): void {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.authService.logout();
    }
  }
}