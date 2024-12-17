import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FormsModule } from '@angular/forms';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { MatDialog } from '@angular/material/dialog';

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
   private router: Router,
   private dialog: MatDialog  
 ) {}

 ngOnInit(): void {

   this.route.params.subscribe(params => {
     this.userId = +params['id'];  
     this.username = params['username'];  
   });
 }

 mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error' | 'info'): void {
  this.dialog.open(AlertDialogComponent, {
    data: { title: titulo, message: mensaje, type: tipo },
  });
}

 onChangePassword(): void {

   if (this.newPassword !== this.confirmNewPassword) {
     this.mostrarAlerta('Error al cambiar la Contraseña', 'Las contraseñas nuevas no coinciden.', 'error');
     return;
   }

   console.log(this.confirmNewPassword)
   this.loginService.changePassword(this.userId, this.confirmNewPassword).subscribe({
     next: (response) => {
      this.mostrarAlerta('Cambio de Contraseña', 'Contraseña actualizada.', 'success');
       this.router.navigate(['']); 
     },
     error: (err) => {
       console.error('Error al cambiar la contraseña', err);
       this.mostrarAlerta('Error al cambiar la Contraseña', 'No se pudo cambiar la Contraseña. Verifique sus credenciales.', 'error');
     }
   });
 }
}
