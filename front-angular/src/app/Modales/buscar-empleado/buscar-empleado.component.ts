import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Empleado } from '../../empleados/models/empleado.models';
import { EmpleadoService } from '../../empleados/services/empleado.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-buscar-empleado',
  standalone: true,
  templateUrl: './buscar-empleado.component.html',
  styleUrl: './buscar-empleado.component.css',
  imports: [MatDialogModule, FormsModule, CommonModule, MatLabel, MatFormField]
})
export class BuscarEmpleadoComponent implements OnInit {
  searchQuery: string = '';
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = []; // Inicializa como lista vacía
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<BuscarEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private empleadosService: EmpleadoService
  ) {}

  ngOnInit(): void {
    this.cargarEmpleados();
  }

  cargarEmpleados(): void {
    this.empleadosService.getEmpleadosEliminado().subscribe({
      next: (data: Empleado[]) => {
        this.empleados = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar los empleados', err);
        this.isLoading = false;
      }
    });
  }

  buscarEmpleados(): void {
    if (this.searchQuery.trim() === '') {
      this.empleadosFiltrados = []; 
    } else {
      this.empleadosFiltrados = this.empleados.filter(empleado =>
        empleado.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        empleado.apellido.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  seleccionarEmpleado(empleado: Empleado): void {
    this.dialogRef.close(empleado); 
  }
}