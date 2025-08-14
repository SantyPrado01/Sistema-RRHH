import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HorarioAsignado } from '../models/horariosAsignados.models'; 
import { HorariosAsignadosService } from '../services/horariosAsignados.service'; 
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../nabvar/navbar.component'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component'; 
import { OrdenTrabajoService } from '../../ordenTrabajo/services/orden-trabajo.service'; 
import { OrdenTrabajo } from '../../ordenTrabajo/models/orden-trabajo.models'; 
import { Empleado } from '../../empleados/models/empleado.models'; 
import { EmpleadoService } from '../../empleados/services/empleado.service'; 
import { BuscarEmpleadoComponent } from '../../Modales/buscar-empleado/buscar-empleado.component'; 
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
import { ServicioService } from '../../servicios/services/servicio.service';

@Component({
  selector: 'app-nuevo-horario',
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
export class NuevoHorarioComponent implements OnInit {
  mostrarEmpleado: boolean = false;
  horariosAsignados: HorarioAsignado[] = [];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ordenTrabajo: OrdenTrabajo[] = [];
  selectedHorario: HorarioAsignado | null = null;
  
  horaInicioReal: string = '';
  horaFinReal: string = '';
  observaciones: string = '';
  comprobado: boolean = true;
  
  fechaSeleccionada: Date | null = null;
  
  horariosForm: FormGroup;
  
  // Arrays para guardar filtrados por fila
  horariosFiltradosEmpresas: any[][] = [];
  horariosFiltradosEmpleados: any[][] = [];
  
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private horarioService: HorariosAsignadosService,
    private dialog: MatDialog,
    private ordenTrabajoService: OrdenTrabajoService,
    private empleadoService: EmpleadoService,
    private empresasService: ServicioService
  ) {
    this.horariosForm = this.fb.group({
      horarios: this.fb.array([])
    });
  }
  
  ngOnInit(): void {
    this.agregarFila(); // Cargar al menos una fila inicial
  }
  
  get horarios(): FormArray {
    return this.horariosForm.get('horarios') as FormArray;
  }
  
  agregarFila(): void {
    const nuevoGrupo = this.fb.group({
      fecha: [null],
      empresa: [''],
      empleado: [''],
      estado: [''],
      observaciones: ['']
    });
    
    const index = this.horarios.length;
    
    // Inicializar arrays de filtrado para la fila
    this.horariosFiltradosEmpresas[index] = [];
    this.horariosFiltradosEmpleados[index] = [];
    
    // Suscripción filtrado empresas
    nuevoGrupo.get('empresa')!.valueChanges.pipe(
      debounceTime(300),
      filter(value => typeof value === 'string' && value.trim().length > 0),
      switchMap(value => this.empresasService.buscarEmpresas(value ?? ''))
    ).subscribe(result => {
      this.horariosFiltradosEmpresas[index] = result || [];
      this.cdr.detectChanges();
    });
    
    // Suscripción filtrado empleados
    nuevoGrupo.get('empleado')!.valueChanges.pipe(
      debounceTime(300),
      filter(value => typeof value === 'string' && value.trim().length > 0),
      switchMap(value => this.empleadoService.buscarEmpleados(value ?? ''))
    ).subscribe(result => {
      this.horariosFiltradosEmpleados[index] = result || [];
      this.cdr.detectChanges();
    });
    
    this.horarios.push(nuevoGrupo);
  }
  
  eliminarFila(index: number): void {
    if (this.horarios.length > 1) { // Evitar eliminar la última fila
      this.horarios.removeAt(index);
      this.horariosFiltradosEmpresas.splice(index, 1);
      this.horariosFiltradosEmpleados.splice(index, 1);
    }
  }
  
  seleccionarEmpresa(index: number, empresa: any): void {
    this.horarios.at(index).get('empresa')!.setValue(empresa);
  }
  
  seleccionarEmpleado(index: number, empleado: any): void {
    this.horarios.at(index).get('empleado')!.setValue(empleado);
  }
  
  displayEmpresaName(empresa: any): string {
    return empresa ? empresa.nombre : '';
  }
  
  displayEmployeeName(empleado: any): string {
    return empleado ? `${empleado.apellido}, ${empleado.nombre}` : '';
  }
  
  guardar(): void {
    if (this.horariosForm.valid) {
      console.log('Datos a guardar:', this.horariosForm.value);
      // Aquí podrías llamar a tu servicio para guardar todo el array
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.horariosForm.markAllAsTouched();
    }
  }
  
  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }
}