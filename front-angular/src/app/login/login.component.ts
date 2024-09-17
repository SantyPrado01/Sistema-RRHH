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
  styleUrl: './login.component.css'
})

export class LoginComponent {

  loginForm: FormGroup

  constructor(private fb:FormBuilder, private service: LoginService, private router:Router){

    this.loginForm = this.fb.group({
      username:['', Validators.required],
      password:['', Validators.required]
    });

  }

  inicioSesion():void{
    if (this.loginForm.valid){
      const formValues = this.loginForm.value;
      console.log('Username', formValues.username);
      console.log('password', formValues.password);
      this.service.login({username: formValues.username, password: formValues.password}).subscribe((data)=>{
        console.log('data: ' + JSON.stringify(data))
        if(data){
          console.log('Exito')
          this.router.navigate(['/home'])
        }
      })
    }
  }

  passwordControl = new FormControl('');
  isPasswordVisible = false;

  togglePasswordVisibility(): void{
    this.isPasswordVisible = !this.isPasswordVisible;
  }


}
