import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { AuthService } from './auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../Modales/mensajes-alerta/mensajes-alerta.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog){}
  
  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

  inicioSesion(): void {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        
        if (response.primerIngreso) {
          this.mostrarAlerta('Cambio de Contraseña', 'Debes cambiar tu contraseña antes de continuar.', 'info');
          this.router.navigate(['/cambio-contrasena', response.id, response.username]);
          
        } else {
          const token = response.token;
          const payload = JSON.parse(atob(token.split('.')[1]));
          const role = payload.role;
  
          if (role === 'admin') {
            this.router.navigate(['/home-admin']);
          } else {
            this.router.navigate(['/home']);
          }
        }
      },
      error: (err) => {
        console.error('Login Error', err);
        this.mostrarAlerta('Error de login', 'No se pudo iniciar sesión. Verifique sus credenciales.', 'error');
      }
    });
  }

}