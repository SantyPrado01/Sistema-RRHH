import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrdenTrabajoService } from '../services/orden-trabajo.service';
import { BuscarEmpresaComponent } from '../../Modales/buscar-empresa/buscar-empresa.component';
import { BuscarEmpleadoComponent } from '../../Modales/buscar-empleado/buscar-empleado.component';
import { Empresa } from '../../servicios/models/servicio.models';
import { Empleado } from '../../empleados/models/empleado.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NabvarComponent } from '../../nabvar/nabvar.component';

@Component({
  selector: 'app-crear-orden-trabajo',
  templateUrl: './crear-orden-trabajo.component.html',
  styleUrls: ['./crear-orden-trabajo.component.css'],
  imports:[CommonModule, FormsModule, NabvarComponent],
  standalone: true,
})
export class CrearOrdenTrabajoComponent {
  empresa: Empresa[] = [];
  empleado: Empleado[] = [];
  mes: string = '';
  anio: number = 0;
  seccionActual: string = 'ordenTrabajo';
  
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => 2024 + i);
  
  necesidad = [
    { diaSemana: 1, nombre: 'Lunes', horaInicio: '', horaFin: '' },
    { diaSemana: 2, nombre: 'Martes', horaInicio: '', horaFin: '' },
    { diaSemana: 3, nombre: 'Miércoles', horaInicio: '', horaFin: '' },
    { diaSemana: 4, nombre: 'Jueves', horaInicio: '', horaFin: '' },
    { diaSemana: 5, nombre: 'Viernes', horaInicio: '', horaFin: '' },
    { diaSemana: 6, nombre: 'Sábado', horaInicio: '', horaFin: '' },
    { diaSemana: 7, nombre: 'Domingo', horaInicio: '', horaFin: '' }
  ];

  constructor(private dialog: MatDialog, private ordenTrabajoService: OrdenTrabajoService, private router: Router) {}

  mostrarSeccion(seccion: string): void {
    this.seccionActual = seccion;
  }

  abrirModalEmpresa() {
    const dialogRef = this.dialog.open(BuscarEmpresaComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empresa = result.nombre;
      }
    });
  }

  abrirModalEmpleado() {
    const dialogRef = this.dialog.open(BuscarEmpleadoComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empleado = result.nombre;
      }
    });
  }

  onSubmit(): void {
    const ordenTrabajoData = {
      servicio: this.empresa, // Asegúrate de agregar esto
      empleadoAsignado: this.empleado, // Ajusta el nombre según lo que espera la API
      mes: this.meses.indexOf(this.mes) + 1, // Convierte el mes a número
      anio: Number(this.anio), // Asegúrate de que sea un número
      horariosAsignados: [],
      necesidadHoraria: this.necesidad.map(dia => ({
        diaSemana: dia.diaSemana,
        horaInicio: dia.horaInicio,
        horaFin: dia.horaFin
      }))
    };
  
    console.log('Datos a enviar:', ordenTrabajoData);
  
    this.ordenTrabajoService.crearOrdenTrabajo(ordenTrabajoData).subscribe({
      next: response => {
        console.log('Orden de trabajo creada con éxito:', response);
        this.router.navigate(['/ruta-donde-redirigir']);
      },
      error: error => {
        if (error.error) {
          console.error('Detalles del error:', error.error);
        }
        console.error('Error al crear la orden de trabajo:', error);
      }
    });
  }

}
