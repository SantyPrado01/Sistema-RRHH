import { Component, HostListener } from '@angular/core';
import { AuthService } from '../login/auth/auth.service';   
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ConfirmacionDialogComponent } from '../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../Modales/mensajes-alerta/mensajes-alerta.component';

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
  isConfigOpen= false;

  username: string | null = '';

  constructor(private authService: AuthService,private dialog: MatDialog ) {document.addEventListener('click', this.handleClickOutside.bind(this));}

  ngOnInit(): void {
    this.username = this.authService.getUsername(); 
  }

  toggleDropdown(menu: string, event: MouseEvent) {
    event.preventDefault(); 
    this.isEmployeesOpen = menu === 'employees' ? !this.isEmployeesOpen : false;
    this.isCompaniesOpen = menu === 'companies' ? !this.isCompaniesOpen : false;
    this.isOrdersOpen = menu === 'orders' ? !this.isOrdersOpen : false;
    this.isBillingOpen = menu === 'billing' ? !this.isBillingOpen : false;
    this.isUserOpen = menu === 'user' ? !this.isUserOpen : false;
    this.isConfigOpen = menu === 'config' ? !this.isConfigOpen : false;
  }

  closeAllDropdowns(): void {
    this.isEmployeesOpen = false;
    this.isCompaniesOpen = false;
    this.isOrdersOpen = false;
    this.isBillingOpen = false;
    this.isUserOpen = false;
    this.isConfigOpen = false
  }

  handleClickOutside(event: MouseEvent) {
    const navbar = document.querySelector('.navbar'); 
    if (!navbar?.contains(event.target as Node)) {
      this.isEmployeesOpen = false;
      this.isCompaniesOpen = false;
      this.isOrdersOpen = false;
      this.isBillingOpen = false;
      this.isUserOpen = false;
      this.isConfigOpen = false;
    }
  }
  
  ngOnDestroy() {
    document.removeEventListener('click', this.handleClickOutside.bind(this));
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmacionDialogComponent,{
      data:{
        title:'Confirmar Cierre de Sesion',
        message:`¿Estás seguro de que deseas cerrar sesion?`,
        type: 'confirm',
      },
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if (result){
        this.authService.logout();
        this.mostrarAlerta('Operación Exitosa', 'Cerraste Sesion con éxito.', 'success')
      } else {
        console.log('Operación cancelada');
      }
    })
  }

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }
}