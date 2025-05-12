import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../login/auth/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmacionDialogComponent } from '../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../Modales/mensajes-alerta/mensajes-alerta.component';
import { MatIconModule } from '@angular/material/icon'; // Mantén esta si usas <mat-icon>
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatIconModule,
    MatDividerModule // Mantén esta si usas <mat-icon>
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isEmployeesOpen = false;
  isCompaniesOpen = false;
  isOrdersOpen = false;
  isBillingOpen = false;
  isUserOpen = false;
  isConfigOpen = false;
  isCollapsed = false;

  username: string | null = '';
  private clickOutsideHandler: (event: MouseEvent) => void;

  constructor(private authService: AuthService, private dialog: MatDialog) {
    this.clickOutsideHandler = this.handleClickOutside.bind(this);
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    document.addEventListener('click', this.clickOutsideHandler);
  }

  toggleDropdown(menu: string, event: MouseEvent): void {
    event.stopPropagation();
    this.closeAllDropdownsExcept(menu);
    switch (menu) {
      case 'employees': this.isEmployeesOpen = !this.isEmployeesOpen; break;
      case 'companies': this.isCompaniesOpen = !this.isCompaniesOpen; break;
      case 'orders': this.isOrdersOpen = !this.isOrdersOpen; break;
      case 'billing': this.isBillingOpen = !this.isBillingOpen; break;
      case 'config': this.isConfigOpen = !this.isConfigOpen; break;
      case 'user': this.isUserOpen = !this.isUserOpen; break;
    }
  }

  toggleNavbar(): void {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.closeAllDropdowns();
    }
  }

  closeAllDropdowns(): void {
    this.isEmployeesOpen = false;
    this.isCompaniesOpen = false;
    this.isOrdersOpen = false;
    this.isBillingOpen = false;
    this.isUserOpen = false;
    this.isConfigOpen = false;
  }

  closeAllDropdownsExcept(menu: string): void {
    if (menu !== 'employees') this.isEmployeesOpen = false;
    if (menu !== 'companies') this.isCompaniesOpen = false;
    if (menu !== 'orders') this.isOrdersOpen = false;
    if (menu !== 'billing') this.isBillingOpen = false;
    if (menu !== 'config') this.isConfigOpen = false;
    if (menu !== 'user') this.isUserOpen = false;
  }

  handleClickOutside(event: MouseEvent): void {
    const navbar = document.querySelector('.navbar');
    if (navbar && !navbar.contains(event.target as Node)) {
      this.closeAllDropdowns();
    }
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.clickOutsideHandler);
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
      data: {
        title: 'Confirmar Cierre de Sesion',
        message: `¿Estás seguro de que deseas cerrar sesion?`,
        type: 'confirm',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
        this.mostrarAlerta('Operación Exitosa', 'Cerraste Sesion con éxito.', 'success');
      }
    });
  }

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }
}