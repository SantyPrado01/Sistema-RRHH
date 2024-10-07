import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './services/login.service';
//import jwt_decode from 'jwt-decode'; // Cambia aquí

interface DecodedToken {
  role: string; // Asegúrate de que esta propiedad coincida con tu token real
  // Agrega otras propiedades según la estructura de tu token
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
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
    console.log('Intentando iniciar sesión...'); // Mensaje de inicio
    if (this.loginForm.valid) {
      const formValues = this.loginForm.value;
      console.log('Username:', formValues.username);
      console.log('Password:', formValues.password);
      
      this.service.login({ username: formValues.username, password: formValues.password }).subscribe({
        next: (data) => {
          console.log('Data:', data);
          if (data) {
            console.log('Éxito');
            localStorage.setItem('token', data.token);
            //const decodedToken = jwt_decode(data.token) as DecodedToken; // Asegúrate de usar as para el tipo
            //localStorage.setItem('role', decodedToken.role);
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          console.error('Error en el inicio de sesión', error);
          alert('Nombre de usuario o contraseña incorrectos');
        }
      });
    } else {
      console.log('Formulario no válido', this.loginForm.errors); // Para mostrar errores en el formulario
    }
  }
  
  
  passwordControl = new FormControl('');
  isPasswordVisible = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
