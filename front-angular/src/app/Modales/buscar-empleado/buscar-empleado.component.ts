import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BuscarEmpresaComponent } from '../buscar-empresa/buscar-empresa.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { Empleado } from '../../empleados/models/empleado.models';
import { EmpleadoService } from '../../empleados/services/empleado.service';

@Component({
  selector: 'app-buscar-empleado',
  standalone: true,
  imports: [MatDialogModule, FormsModule, CommonModule,MatLabel,MatFormField],
  templateUrl: './buscar-empleado.component.html',
  styleUrl: './buscar-empleado.component.css'
})
export class BuscarEmpleadoComponent implements OnInit {
  searchQuery: string = '';
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  isLoading = true;

  constructor(
    public dialogRef: MatDialogRef<BuscarEmpleadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private empleadosService: EmpleadoService
  ) {}

  ngOnInit():void{
    this.cargarEmpleados();
  }

  cargarEmpleados(): void{
    this.empleadosService.getEmpleados().subscribe({
      next: (data: Empleado[]) => {
        this.empleados = data;
        this.empleadosFiltrados = data;
        this.isLoading = false;
      },
      error: (err) =>{
        console.error('Error al cargar los empleados', err);
        this.isLoading = false;
      }
    })
  }

  buscarEmpleados(): void{
    this.empleadosFiltrados = this.empleados.filter(empleados =>
      empleados.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
      empleados.apellido.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }



  seleccionarEmpleado(empleado: any) {
    this.dialogRef.close(empleado); // Devuelve la empresa seleccionada
  }

}
