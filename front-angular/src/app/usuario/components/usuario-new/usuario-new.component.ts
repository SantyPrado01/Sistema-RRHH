import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../nabvar/navbar.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AlertDialogComponent } from '../../../Modales/mensajes-alerta/mensajes-alerta.component';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/ususario.models';
import { ConfirmacionDialogComponent } from '../../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';

@Component({
  selector: 'app-usuario-new',
  standalone: true,
  imports: [FormsModule, NavbarComponent, CommonModule, MatIconModule],
  templateUrl: './usuario-new.component.html',
  styleUrls: ['./usuario-new.component.css']
})
export class UsuarioNewComponent implements OnInit {

  usuarios: Usuario[] = [];
  usuario: any = {}; 
  categorias: any[] = [];
  selectedUsuario: Usuario | null = null;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.loadUsuarios();
    this.usuarioService.getCategoriasUser().subscribe({
      next: (data) => {
        console.log('Categorias Usuario:', data);
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener las categorias', err);
      },
    });
  }

  getCategoriaNombre(id: number): string {
    const categoria = this.categorias.find(c => c.categoria === id);
    return categoria ? categoria.nombre : 'Desconocido';
  }


  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data: Usuario[]) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al cargar los usuarios', err);
      },
    });
  }

  selectUsuario(usuario: Usuario): void {
    this.selectedUsuario = usuario;
    this.usuario = { ...usuario }; 
  }

  cancelarEdicion(): void {
    this.selectedUsuario = null;
    this.usuario = {
      username: ''
    }  
  }

  recuperarPassword(): void {
    if (!this.selectedUsuario) {
      this.mostrarAlerta('Error', 'Debes seleccionar un usuario para recuperar la contraseña.', 'error');
      return;
    }
  
    const usuarioId = this.selectedUsuario.id;
  
    this.usuarioService.recuperarPassword(usuarioId).subscribe({
      next: (response:any) => {
        const mensaje = `Contraseña recuperada con éxito. Contraseña temporal: ${response.temporaryPassword}`;
        this.mostrarAlerta('Operación Exitosa', mensaje, 'success');
      },
      error: (err) => {
        console.error('Error al recuperar la contraseña', err);
        this.mostrarAlerta('Error', 'No se pudo recuperar la contraseña.', 'error');
      },
    });
  }
  

  guardarUsuario(): void {
    console.log(this.usuario)
    this.usuarioService.createUsuario(this.usuario).subscribe({
      next: (response: any) => {
        const mensaje = `Usuario guardado con éxito. Contraseña temporal: ${response.temporaryPassword}`;
        this.mostrarAlerta('Operación Exitosa', mensaje, 'success');
        this.cancelarEdicion(); 
        this.loadUsuarios();
      },
      error: (err) => {
        console.log(this.usuario)
        console.error('Error al guardar el usuario', err);
        this.mostrarAlerta('Error', 'No se pudo guardar el usuario.', 'error');
      },
    });
  }

  actualizarUsuario(): void {
    if (!this.selectedUsuario) {
      this.mostrarAlerta('Error', 'Debes seleccionar un usuario para actualizar.', 'error');
      return;
    }

    const usuarioId = this.selectedUsuario.id;

    if (usuarioId) {
      this.usuario.categoriaId = Number(this.usuario.categoriaId);
      this.usuarioService.updateUsuario(usuarioId, this.usuario).subscribe({
        next: (response) => {
          this.mostrarAlerta('Operación Exitosa', 'Usuario actualizado con éxito.', 'success');
          this.cancelarEdicion();
          this.loadUsuarios(); 
        },
        error: (err) => {
          console.error('Error al actualizar el usuario', err);
          this.mostrarAlerta('Error', 'No se pudo actualizar el usuario.', 'error');
        },
      });
    }
  }

  eliminarUsuario(usuario: Usuario): void {
  const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
      data: {
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar al usuario "${usuario.username}"?`,
        type: 'confirm',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) { // Si el usuario confirma
        const usuarioId = Number(usuario.id);

        this.usuarioService.deleteUsuario(usuarioId).subscribe({
          next: (response) => {
            console.log('Usuario eliminado con éxito:', response);
            this.mostrarAlerta('Operación Exitosa', 'Usuario eliminado con éxito.', 'success');
            this.loadUsuarios(); // Recargar la lista de usuarios
          },
          error: (err) => {
            console.error('Error al eliminar el usuario:', err);
            this.mostrarAlerta('Error', 'No se pudo eliminar el usuario.', 'error');
          },
        });
      } else {
        console.log('Operación de eliminación cancelada');
      }
    });
  }



  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

}

