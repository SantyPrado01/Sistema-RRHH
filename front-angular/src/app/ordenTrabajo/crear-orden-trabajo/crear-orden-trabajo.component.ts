import { Component } from '@angular/core';
import { ServicioService } from '../../servicios/services/servicio.service';
import { EmpleadoService } from '../../empleados/services/empleado.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Empleado } from '../../empleados/models/empleado.models';
import { Empresa } from '../../servicios/models/servicio.models';

@Component({
  selector: 'app-crear-orden-trabajo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-orden-trabajo.component.html',
  styleUrl: './crear-orden-trabajo.component.css'
})
export class CrearOrdenTrabajoComponent {
  horariosAsignados: any[] = [];
  servicioBusqueda: string = '';
  empleadoBusqueda: string = '';
  serviciosFiltrados: any[] = [];
  empleadosFiltrados: any[] = [];
  anioSeleccionado: number = new Date().getFullYear();
  mesSeleccionado: number = new Date().getMonth() + 1;
  horaInicio: string = "00:00";
  horaFin: string = "00:00";
  filteredEmpleados: Empleado[] = [];
  selectedEmpleado: Empleado | null = null;
  filteredServicios:Empresa[] = [];
  selectedServicio: Empresa | null = null;

  // Listas de Años y Meses
  anios: number[] = Array.from({ length: 2035 - 2023 + 1 }, (_, i) => 2023 + i);
  meses = [
    { id: 1, nombre: 'Enero' },
    { id: 2, nombre: 'Febrero' },
    { id: 3, nombre: 'Marzo' },
    { id: 4, nombre: 'Abril' },
    { id: 5, nombre: 'Mayo' },
    { id: 6, nombre: 'Junio' },
    { id: 7, nombre: 'Julio' },
    { id: 8, nombre: 'Agosto' },
    { id: 9, nombre: 'Septiembre' },
    { id: 10, nombre: 'Octubre' },
    { id: 11, nombre: 'Noviembre' },
    { id: 12, nombre: 'Diciembre' },
  ];
    // Días con nombre y estado "checked"
  diasSeleccionados = [
    { nombre: 'Lunes', checked: false },
    { nombre: 'Martes', checked: false },
    { nombre: 'Miércoles', checked: false },
    { nombre: 'Jueves', checked: false },
    { nombre: 'Viernes', checked: false },
    { nombre: 'Sábado', checked: false },
    { nombre: 'Domingo', checked: false },
  ];

  constructor(
    private servicioService: ServicioService,
    private empleadoService: EmpleadoService
  ) {}

  buscarServicios() {
    this.servicioService.getServicios()
      .subscribe((servicios) => {
        this.serviciosFiltrados = servicios;
      });
  }

  seleccionarServicio(servicio: any) {
    this.servicioBusqueda = servicio.nombre;
    this.serviciosFiltrados = [];
  }

  buscarEmpleados() {
    this.empleadoService.getEmpleados()
      .subscribe((empleados) => {
        this.empleadosFiltrados = empleados;
      });
  }

  seleccionarEmpleado(empleado: any) {
    this.empleadoBusqueda = `${empleado.nombre} ${empleado.apellido}`;
    this.empleadosFiltrados = [];
  }
  updateDias() {
    this.diasSeleccionados = this.diasSeleccionados.filter(dia => dia.checked);
  }

  crearOrdenTrabajo() {
    const ordenTrabajo = {
      servicio: this.servicioBusqueda,
      empleadoAsignado: this.empleadoBusqueda,
      mes: this.mesSeleccionado,
      anio: this.anioSeleccionado,
      dias:  this.diasSeleccionados = this.diasSeleccionados.filter(dia => dia.checked),
      horaInicio: this.horaInicio,
      horaFin: this.horaFin
    };
    
    // Lógica para enviar la orden de trabajo al backend
    console.log(ordenTrabajo);
  }

}
