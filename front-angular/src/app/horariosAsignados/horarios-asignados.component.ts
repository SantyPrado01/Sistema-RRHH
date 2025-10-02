import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HorarioAsignado } from './models/horariosAsignados.models';
import { HorariosAsignadosService } from './services/horariosAsignados.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../nabvar/navbar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertDialogComponent } from '../Modales/mensajes-alerta/mensajes-alerta.component';
import { OrdenTrabajoService } from '../ordenTrabajo/services/orden-trabajo.service';
import { OrdenTrabajo } from '../ordenTrabajo/models/orden-trabajo.models';
import { Empleado } from '../empleados/models/empleado.models';
import { EmpleadoService } from '../empleados/services/empleado.service';
import { BuscarEmpleadoComponent } from '../Modales/buscar-empleado/buscar-empleado.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { debounceTime, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-horarios-asignados',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    NavbarComponent, 
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  templateUrl: './horarios-asignados.component.html',
  styleUrls: ['./horarios-asignados.component.css'] 
})
export class HorariosAsignadosComponent implements OnInit {
  
  mostrarEmpleado: boolean = false;
  horariosAsignados: HorarioAsignado[] = [];
  dataSource: MatTableDataSource<HorarioAsignado>;
  displayedColumns: string[] = ['empresa', 'empleado', 'fecha', 'horaInicio', 'horaFin'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ordenTrabajo: OrdenTrabajo [] = [];
  selectedHorario: HorarioAsignado | null = null; 
  horaInicioReal: string = '';
  horaFinReal: string = '';
  estado: string = ''; 
  estadoSuplente: string = '';
  observaciones: string = '';
  comprobado: boolean = true; 

  empleadoSuplenteControl = new FormControl('');
  empleadosFiltrados: Empleado[] = [];
  empleadoSup: Empleado | null = null;
  empleadoSuplenteNombre: string = '';
  fechaSeleccionada: Date | null = null;

  constructor(
    private cdr: ChangeDetectorRef, 
    private horarioService: HorariosAsignadosService, 
    private dialog: MatDialog, 
    private ordenTrabajoService: OrdenTrabajoService,
    private empleadoService: EmpleadoService
  ) {
    this.dataSource = new MatTableDataSource<HorarioAsignado>([]);
    
      // Configurar el filtro personalizado
      this.dataSource.filterPredicate = (data: HorarioAsignado, filter: string) => {
      const filterLower = filter.toLowerCase();
      
      // Filtro por empleado (nombre y apellido en diferentes órdenes)
      const nombreCompleto = `${data.empleado.nombre} ${data.empleado.apellido}`.toLowerCase();
      const apellidoNombre = `${data.empleado.apellido} ${data.empleado.nombre}`.toLowerCase();
      const empleadoMatch = nombreCompleto.includes(filterLower) || apellidoNombre.includes(filterLower);
      
      // Filtro por empresa
      const empresaNombre = data.ordenTrabajo.servicio.nombre.toLowerCase();
      const empresaMatch = empresaNombre.includes(filterLower);
      
      // Retorna true si coincide con empleado O empresa
      return empleadoMatch || empresaMatch;
    };
  }
  
  ngOnInit(): void {
    console.log('Componente HorariosAsignados inicializado');
    this.fetchHorarios();
    this.setupEmpleadoSuplenteAutocomplete();
  }

  setupEmpleadoSuplenteAutocomplete(): void {
    this.empleadoSuplenteControl.valueChanges
      .pipe(
        debounceTime(300),
        filter(value => typeof value === 'string'),
        switchMap(value => this.empleadoService.buscarEmpleados(value || ''))
      )
      .subscribe(empleados => {
        this.empleadosFiltrados = empleados;
      });
  }

  seleccionarEmpleadoSuplente(empleado: Empleado): void {
    this.empleadoSup = empleado;
    this.empleadoSuplenteNombre = `${empleado.apellido}, ${empleado.nombre}`;
  }

  displayEmployeeName(empleado: Empleado): string {
    return empleado ? `${empleado.apellido}, ${empleado.nombre}` : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar ordenamiento personalizado para la columna de empresa
    this.dataSource.sortingDataAccessor = (item: HorarioAsignado, property: string): string | number => {
      switch(property) {
        case 'empresa': return item.ordenTrabajo.servicio.nombre;
        case 'empleado': return item.empleado.apellido + ', ' + item.empleado.nombre;
        case 'fecha': return new Date(item.fecha).getTime();
        default: return '';
      }
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectHorario(horario: HorarioAsignado): void {
    if (this.selectedHorario === horario) {
      this.selectedHorario = null; 
    } else {
      this.selectedHorario = horario;
      this.horaInicioReal = horario.horaInicioProyectado || '';
      this.horaFinReal = horario.horaFinProyectado || '';
      this.estado = horario.estado || '';
      this.estadoSuplente = horario.estadoSuplente || '';
      this.observaciones = horario.observaciones || ''; 
      if (horario.fecha) {
        const fecha = new Date(horario.fecha);
        this.fechaSeleccionada = fecha;
      }  
    }
    console.log('Fila seleccionada:', this.selectedHorario);
    this.cdr.detectChanges();
  }

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }
  
  fetchHorarios(): void {
    console.log('Obteniendo horarios asignados...');
    this.horarioService.getHorariosAsignados().subscribe(data => {
      this.horariosAsignados = data;
      console.log('Horarios asignados obtenidos:', data);
      this.dataSource.data = data;
    });
  }

  cambiarEstado(nuevoEstado: string){
    if (nuevoEstado === 'Sin Servicio') {
      this.horaInicioReal = '';
      this.horaFinReal = '';
    }
  }
  
  actualizarHorarios(){
    if (!this.selectedHorario) return;

    // Manejamos la fecha seleccionada
    let fecha: Date;
    if (this.fechaSeleccionada) {
      fecha = this.fechaSeleccionada;
      fecha.setHours(3, 0, 0, 0);
    } else if (this.selectedHorario.fecha) {
      fecha = new Date(this.selectedHorario.fecha);
    } else {
      return;
    }

    if ((this.estado === 'Faltó Con Aviso' || this.estado === 'Faltó Sin Aviso') && !this.empleadoSup) {
      this.horaInicioReal = '';
      this.horaFinReal = '';
    }

    const updatedHorario: HorarioAsignado = {
      ...this.selectedHorario,
      horaInicioReal: this.horaInicioReal,
      horaFinReal: this.horaFinReal,
      estado: this.estado,
      estadoSuplente: this.estadoSuplente,
      observaciones: this.observaciones,
      comprobado: true,
      empleadoSuplente: this.empleadoSup!,
      suplente: this.mostrarEmpleado,
      fecha: fecha
    };
    console.log('Datos enviados para actualización:', updatedHorario);

    this.horarioService.updateHorario(updatedHorario).subscribe({
      next: (response) => {
        console.log('Horario actualizado:', response);
        this.mostrarAlerta('Actualización Exitosa', 'El horario ha sido actualizado exitosamente.', 'success');
        this.cancelarEdicion()
        this.ngOnInit()
      },
      error: (error) => {
        console.error('Error al actualizar el horario:', error);
        alert('Hubo un error al actualizar el horario. Inténtelo de nuevo.');
      }
    });
    this.ngOnInit()
  }

  cancelarEdicion() {
    this.selectedHorario = null;
    this.horaInicioReal = '';
    this.horaFinReal = '';
    this.estado = '';
    this.estadoSuplente = '';
    this.observaciones = '';
    this.empleadoSuplenteControl.reset();
    this.empleadoSuplenteNombre = '';
    this.mostrarEmpleado = false;
    this.empleadoSup = null;
    this.fechaSeleccionada = null;
  }

  abrirModalEmpleado() {
      const dialogRef = this.dialog.open(BuscarEmpleadoComponent);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.empleadoSup = result;
          this.empleadoSuplenteNombre = result.nombre + ' ' + result.apellido;
        }
      });
    }

}
