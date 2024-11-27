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
    this.selectedUsuario = null;  // Resetear el formulario
  }

  guardarUsuario(): void {
    this.usuarioService.createUsuario(this.usuario).subscribe({
      next: (response) => {
        console.log('Usuario Guardado', response);
        console.log(this.usuario)
        this.mostrarAlerta('Operación Exitosa', 'Usuario guardado con éxito.' , 'success');
        this.cancelarEdicion(); // Limpiar el formulario después de guardar
      },
      error: (err) => {
        console.log(this.usuario)
        console.error('Error al guardar el usuario', err);
        this.mostrarAlerta('Error', 'No se pudo guardar el usuario.', 'error');
      },
    });
  }

  actualizarUsuario(): void {
    if (this.usuario.id) {
      this.usuarioService.updateUsuario(this.usuario.Id, this.usuario).subscribe({
        next: (response) => {
          console.log('Usuario actualizado', response);
          this.mostrarAlerta('Operación Exitosa', 'Usuario actualizado con éxito.', 'success');
          this.cancelarEdicion(); // Limpiar el formulario después de la actualización
        },
        error: (err) => {
          console.error('Error al actualizar el usuario', err);
          this.mostrarAlerta('Error', 'No se pudo actualizar el usuario.', 'error');
        },
      });
    }
  }

  eliminarUsuario(usuario: Usuario): void{
    console.log(usuario)
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      const usuarioId = Number(usuario.id);

      this.usuarioService.deleteUsuario(usuarioId).subscribe({
        next: (response) => {
          console.log('Usuario eliminada con éxito:', response);
          alert('Usuario eliminada con éxito');
          this.router.navigate(['/service']); 
        },
        error: (err) => {
          console.log('ID de la empresa:', usuarioId);
          console.error('Error al eliminar la empresa:', err);
        }
      });
    } else {
      console.log('Operación cancelada');
    }
  }


  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

}

