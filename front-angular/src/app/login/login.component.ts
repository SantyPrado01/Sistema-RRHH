import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Corrige "styleUrl" a "styleUrls"
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private service: LoginService, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  inicioSesion(): void {
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      console.log('Username', formValues.username);
      console.log('Password', formValues.password);
      
      this.service.login({ username: formValues.username, password: formValues.password }).subscribe(
        (data) => {
          console.log('Data: ' + JSON.stringify(data));
          if (data) {
            console.log('Éxito');
            
            // Almacenar el token en el localStorage
            localStorage.setItem('token', data.token);
            
            // Decodificar el token para obtener el rol (si está presente)
            const jwt_decode = require('jwt-decode'); // Asegúrate de que esta línea no dé errores
            localStorage.setItem('role', jwt_decode.role); // Almacena el rol, si es necesario

            // Navegar a la página de inicio
            this.router.navigate(['/home']);
          }
        },
        (error) => {
          // Manejo de errores
          console.error('Error en el inicio de sesión', error);
          alert('Nombre de usuario o contraseña incorrectos'); // Mensaje de error
        }
      );
    }
  }

  passwordControl = new FormControl('');
  isPasswordVisible = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
