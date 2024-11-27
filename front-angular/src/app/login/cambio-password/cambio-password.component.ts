import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cambio-password',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cambio-password.component.html',
  styleUrl: './cambio-password.component.css'
})
export class CambioPasswordComponent {
 
 userId: number = 0;
 username: string = '';
 currentPassword: string = '';  
 newPassword: string = '';  
 confirmNewPassword: string = '';  

 constructor(
   private route: ActivatedRoute,  
   private loginService: LoginService,  
   private router: Router  
 ) {}

 ngOnInit(): void {

   this.route.params.subscribe(params => {
     this.userId = +params['id'];  
     this.username = params['username'];  
   });
 }

 onChangePassword(): void {

   if (this.newPassword !== this.confirmNewPassword) {
     alert('Las contraseñas nuevas no coinciden.');
     return;
   }

   console.log(this.confirmNewPassword)
   this.loginService.changePassword(this.userId, this.confirmNewPassword).subscribe({
     next: (response) => {
       console.log('Contraseña cambiada con éxito');
       this.router.navigate(['']); 
     },
     error: (err) => {
       console.error('Error al cambiar la contraseña', err);
       alert('Hubo un problema al cambiar la contraseña.');
     }
   });
 }
}
