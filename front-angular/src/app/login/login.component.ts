import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
import { AuthService } from './auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../Modales/mensajes-alerta/mensajes-alerta.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  username: string = '';
  password: string = '';
  hide = signal(true);

  constructor(private authService: AuthService, private router: Router, private dialog: MatDialog){}

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  
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