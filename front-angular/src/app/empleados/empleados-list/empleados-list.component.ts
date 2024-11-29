import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { Empleado } from '../models/empleado.models';
import { EmpleadoService } from '../services/empleado.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { title } from 'process';
import { response } from 'express';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule, MatIconModule, FormsModule],
  templateUrl: './empleados-list.component.html',
  styleUrl: './empleados-list.component.css'
})
export class EmpleadosListComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  searchTerm: string = '';
  filtroVisualizar: string = 'activo'; 
  filtroOrdenar: string = 'nombre';     


  constructor(private empleadoService: EmpleadoService, private route: ActivatedRoute, 
    private router: Router, private http: HttpClient, private dialog: MatDialog ) {}


  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
      this.dialog.open(AlertDialogComponent, {
        data: { title: titulo, message: mensaje, type: tipo },
      });
    }

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  obtenerEmpleados() {
    this.empleadoService.getEmpleados().subscribe((data: Empleado[]) => {
      this.empleados = data;
      this.filtrarEmpleados();
    });
  }

  buscarEmpleado() {
    this.filtrarEmpleados();
  }

  filtrarEmpleados() {
    this.empleadosFiltrados = this.empleados.filter(empleado => {
      const coincideEstado = this.filtroVisualizar === 'activo' ? !empleado.eliminado : empleado.eliminado;
      if(!coincideEstado) return false;
      const coincideNombreApellido = empleado.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                     empleado.apellido.toLowerCase().includes(this.searchTerm.toLowerCase());
      return coincideEstado && coincideNombreApellido;
    });

    if (this.filtroOrdenar === 'nombre'){
      this.empleadosFiltrados.sort((a,b) => a.nombre.localeCompare(b.nombre));
    } else if (this.filtroOrdenar === 'apellido'){
      this.empleadosFiltrados.sort((a,b) => a.apellido.localeCompare(b.apellido))
    }
  }

  eliminarEmpleado(empleado: Empleado) {
    const dialogRef = this.dialog.open(ConfirmacionDialogComponent,{
      data:{
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar la categoria "${empleado.apellido} ${empleado.nombre}"?`,
        type: 'confirm'
      }
    });
    dialogRef.afterClosed().subscribe((result) =>{
      if (result){
        const empleadoId = Number(empleado.Id);
        this.empleadoService.deleteEmpleado(empleadoId).subscribe({
          next: (response) =>{
            console.log('Empleado eliminado con éxito', response);
            this.mostrarAlerta('Operación Exitosa', 'Empleado eliminada con éxito.', 'success');
            this.ngOnInit();
          },
          error:(err) => {
            console.error('Error al eliminar la categoria:', err);
            this.mostrarAlerta('Error', 'No se pudo eliminar la categoria.', 'error');
          },
        });
      } else {
        console.log('Operacion de eliminacion cancelada.')
      }
    })
  }
}
