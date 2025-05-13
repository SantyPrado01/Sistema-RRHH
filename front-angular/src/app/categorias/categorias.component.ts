import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../nabvar/navbar.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Categoria } from './models/categoria.models';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CategoriaService } from './services/categoria.service';
import { AlertDialogComponent } from '../Modales/mensajes-alerta/mensajes-alerta.component';
import { ConfirmacionDialogComponent } from '../Modales/mensajes-confirmacion/mensajes-confirmacion.component';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule],
  templateUrl: './categorias.component.html',
  styleUrl: './categorias.component.css'
})
export class CategoriasComponent implements OnInit{

  categorias: Categoria[] = [];
  categoria: any = {};
  selectedCategoria: Categoria | null = null;

  constructor(private dialog: MatDialog, private router: Router, private categoriaService: CategoriaService){}

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

  ngOnInit(): void {
    this.categoriaService.getCategorias().subscribe({
      next:(data: Categoria[]) =>{
        this.categorias = data
      },
      error: (err) =>{
        console.error('Error al cargar las categorias', err)
      }
    })
  }

  selectCategoria(categoria:Categoria): void{
    this.selectedCategoria = categoria;
    this.categoria = {...categoria}
  }

  cancelarEdicion(): void{
    this.selectedCategoria = null
    this.categoria = {
      nombre: ''
    }
  }

  guardarCategoria(): void{
    this.categoriaService.createCategoria(this.categoria).subscribe({
      next: (response) =>{
        console.log('Categoria Guardada', response)
        this.mostrarAlerta('Operación Exitosa', 'Categoria guardada con éxito.', 'success');
        this.cancelarEdicion()
        this.ngOnInit()
      },
      error:(err) =>{
        console.error('Error al guardar el usuario', err);
        this.mostrarAlerta('Error', 'No se pudo guardar el usuario.', 'error');
      }
    })
  }

  actualizarCategoria(): void{
    if (!this.selectedCategoria) {
      this.mostrarAlerta('Error', 'Debes seleccionar una categoria para actualizar.', 'error');
      return;
    }
    const categoriaId = this.selectedCategoria.id;
    if (categoriaId) {
      this.categoriaService.updateCategoria(categoriaId, this.categoria).subscribe({
        next: (response) => {
          this.mostrarAlerta('Operación Exitosa', 'Categoria actualizada con éxito.', 'success');
          this.cancelarEdicion(); 
          this.ngOnInit()
        },
        error: (err) => {
          console.error('Error al actualizar la categoria.', err);
          this.mostrarAlerta('Error', 'No se pudo actualizar la categoria.', 'error');
        },
      });
    }
  }

  eliminarCategoria(categoria: Categoria): void {
    const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
        data: {
          title: 'Confirmar Eliminación',
          message: `¿Estás seguro de que deseas eliminar la categoria "${categoria.nombre}"?`,
          type: 'confirm',
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const categoriaId = Number(categoria.id);
          this.categoriaService.deleteCategoria(categoriaId).subscribe({
            next: (response) => {
              console.log('Categoria eliminada con éxito:', response);
              this.mostrarAlerta('Operación Exitosa', 'Categoria eliminada con éxito.', 'success');
              this.ngOnInit(); 
            },
            error: (err) => {
              console.error('Error al eliminar la categoria:', err);
              this.mostrarAlerta('Error', 'No se pudo eliminar la categoria.', 'error');
            },
          });
        } else {
          console.log('Operación de eliminación cancelada');
        }
      });
    }



}
