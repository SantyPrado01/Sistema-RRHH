import { Component, Inject, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../login/auth/auth.service'; 
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionDialogComponent } from '../Modales/mensajes-confirmacion/mensajes-confirmacion.component'; 
import { AlertDialogComponent } from '../Modales/mensajes-alerta/mensajes-alerta.component';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone:true,
  imports:[
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  username: string | null = '';
  isCollapsed = false;
  isEmployeesOpen = false;
  isCompaniesOpen = false;
  isOrdersOpen = false;
  isBillingOpen = false;
  isConfigOpen = false;
  isUserOpen = false;

  private clickOutsideHandler: any;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.clickOutsideHandler = this.handleClickOutside.bind(this);
  }

  ngOnInit(): void {
    this.username = this.authService.getUsername();

    if (isPlatformBrowser(this.platformId)) {
      document.addEventListener('click', this.clickOutsideHandler);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.clickOutsideHandler);
    }
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
    if (isPlatformBrowser(this.platformId)) {
      const navbar = document.querySelector('.navbar');
      if (navbar && !navbar.contains(event.target as Node)) {
        this.closeAllDropdowns();
      }
    }
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
