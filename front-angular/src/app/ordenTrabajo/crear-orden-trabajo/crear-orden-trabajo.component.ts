import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Data, Router } from '@angular/router';
import { OrdenTrabajoService } from '../services/orden-trabajo.service';
import { BuscarEmpresaComponent } from '../../Modales/buscar-empresa/buscar-empresa.component';
import { BuscarEmpleadoComponent } from '../../Modales/buscar-empleado/buscar-empleado.component';
import { Empresa } from '../../servicios/models/servicio.models';
import { Empleado } from '../../empleados/models/empleado.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';

@Component({
  selector: 'app-crear-orden-trabajo',
  templateUrl: './crear-orden-trabajo.component.html',
  styleUrls: ['./crear-orden-trabajo.component.css'],
  imports:[CommonModule, FormsModule, NavbarComponent],
  standalone: true,
})
export class CrearOrdenTrabajoComponent {
  horasProyectadas: number = 0;
  empresa: Empresa[] = [];
  empresaNombre: string = '';
  empleado: Empleado[] = [];
  empleadoNombre: string = '';
  seccionActual: string = 'ordenTrabajo';
  fechaDesde: Date = new Date();
  fechaHasta: Date = new Date();

  fechaOrden: Date = new Date(); 
  horaInicio: Date = new Date();
  horaFin: string = '';
  
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => 2024 + i);
  
  necesidad = [
    { diaSemana: 1, nombre: 'Lunes', horaInicio: '', horaFin: '' },
    { diaSemana: 2, nombre: 'Martes', horaInicio: '', horaFin: '' },
    { diaSemana: 3, nombre: 'Miércoles', horaInicio: '', horaFin: '' },
    { diaSemana: 4, nombre: 'Jueves', horaInicio: '', horaFin: '' },
    { diaSemana: 5, nombre: 'Viernes', horaInicio: '', horaFin: '' },
    { diaSemana: 6, nombre: 'Sábado', horaInicio: '', horaFin: '' },
    { diaSemana: 0, nombre: 'Domingo', horaInicio: '', horaFin: '' },
  ];

  constructor(private dialog: MatDialog, private ordenTrabajoService: OrdenTrabajoService, private router: Router) {}

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

  private contarDiasEnMes(mes: number, anio: number, diaSemana: number): number {
    let contador = 0;
    const fecha = new Date(anio, mes - 1, 1);
    console.log(fecha)
    while (fecha.getMonth() === mes - 1) {
      if (fecha.getDay() === diaSemana) {
        contador++;
      }
      fecha.setDate(fecha.getDate() + 1);
    }
    return contador;
  }
   
  mostrarSeccion(seccion: string): void {
    this.seccionActual = seccion;
    this.limpiarCampos();
  }

  abrirModalEmpresa() {
    const dialogRef = this.dialog.open(BuscarEmpresaComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empresa = result;
        this.empresaNombre = result.nombre;
      }
    });
  }

  abrirModalEmpleado() {
    const dialogRef = this.dialog.open(BuscarEmpleadoComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empleado = result;
        this.empleadoNombre = result.nombre + ' ' + result.apellido
      }
    });
  }

  onSubmit(): void {
      const ordenTrabajoData = {
        fechaDesde: this.fechaDesde,
        fechaHasta: this.fechaHasta,
        servicio: this.empresa,
        empleadoAsignado: this.empleado,
        horariosAsignados: [],
        necesidadHoraria: this.necesidad.map((dia) => ({
          diaSemana: dia.diaSemana,
          horaInicio: dia.horaInicio,
          horaFin: dia.horaFin,
        })),
      };
  
      console.log('Datos a enviar:', ordenTrabajoData);
  
      this.ordenTrabajoService.crearOrdenTrabajo(ordenTrabajoData).subscribe({
        next: () => {
          this.mostrarAlerta(
            'Operación Exitosa',
            'Orden creada con éxito.',
            'success'
          );
          this.limpiarCampos();
        },
        error: (error) => {
          this.mostrarAlerta(
            'Error Operación',
            `${error.error.message || 'Error al crear la orden de trabajo.'}`,
            'error'
          );
          console.error('Error al crear la orden de trabajo:', error);
        },
      });
  }
  
  limpiarCampos(): void {
    this.empresaNombre = '';
    this.empleadoNombre = '';
    this.fechaDesde = new Date();
    this.fechaHasta = new Date();
    this.fechaOrden = new Date();
    this.horaInicio = new Date();
    this.horaFin = '';
    this.necesidad = [
      { diaSemana: 1, nombre: 'Lunes', horaInicio: '', horaFin: '' },
      { diaSemana: 2, nombre: 'Martes', horaInicio: '', horaFin: '' },
      { diaSemana: 3, nombre: 'Miércoles', horaInicio: '', horaFin: '' },
      { diaSemana: 4, nombre: 'Jueves', horaInicio: '', horaFin: '' },
      { diaSemana: 5, nombre: 'Viernes', horaInicio: '', horaFin: '' },
      { diaSemana: 6, nombre: 'Sábado', horaInicio: '', horaFin: '' },
      { diaSemana: 7, nombre: 'Domingo', horaInicio: '', horaFin: '' }
    ];
    this.horasProyectadas = 0; 
  }
  
  cancelar() {
    this.mostrarAlerta('Operacion Cancelada', 'Orden de Trabajo no Creada.', 'success');
    this.router.navigate(['/ordentrabajo']);
  }
}
