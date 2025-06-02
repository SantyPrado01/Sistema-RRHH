import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { Empleado } from '../models/empleado.models';
import { EmpleadoService } from '../services/empleado.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { getSpanishPaginatorIntl } from '../../spanish-paginator-intl';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, filter, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    MatIconModule, 
    MatTableModule, 
    MatButtonModule, 
    MatPaginatorModule, 
    MatProgressBarModule, 
    MatOptionModule, 
    MatInputModule, 
    MatFormFieldModule, 
    MatAutocompleteModule, 
    ReactiveFormsModule,
    MatSortModule,
    MatProgressBarModule
    ],
  templateUrl: './empleados-list.component.html',
  styleUrl: './empleados-list.component.css',
  providers: [
      DatePipe,
      { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
      { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
    ],
})
export class EmpleadosListComponent implements OnInit {
  empleados: Empleado[] = [];

  empleadoControl = new FormControl('');
  empleadosFiltrados: any[] = [];

  empleadoId?: number;

  loading: boolean = false
  dataSource = new MatTableDataSource<any>([]);
  searchTerm: string = '';
  filtroVisualizar: string = 'activo'; 
  filtroOrdenar: string = 'nombre';
  
  private matPaginator!: MatPaginator;
      @ViewChild(MatPaginator) set matPaginatorSetter(mp: MatPaginator) {
        this.matPaginator = mp;
        if (this.dataSource){
          this.dataSource.paginator = this.matPaginator;
          this.matPaginator.firstPage();
        }
      }

  private matSort!: MatSort;
    @ViewChild(MatSort) set matSortSetter(ms: MatSort) {
      this.matSort = ms;
      if (this.dataSource) {
        this.dataSource.sort = this.matSort;
      }
    }


  constructor(
    private empleadoService: EmpleadoService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private http: HttpClient, 
    private dialog: MatDialog 
  ) {}


  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
      this.dialog.open(AlertDialogComponent, {
        data: { title: titulo, message: mensaje, type: tipo },
      });
    }

  ngOnInit(): void {
    this.loading = true
    this.empleadoControl.valueChanges
            .pipe(
              debounceTime(300),
              filter(value => typeof value === 'string'), 
              switchMap(value => this.empleadoService.buscarEmpleados(value))
            )
            .subscribe(result => {
              this.empleadosFiltrados = result;
            });
    this.dataSource.sortingDataAccessor = (item: any, headerId: string) => {
      if(item){
        switch(headerId){
          case 'legajo': return item.legajo;
          case 'nombre': return item.nombre;
          case 'apellido': return item.apellido

          default: return (item as any)[headerId];
        }
      }
    }
    this.obtenerEmpleados();

  }

  displayedColumns: string[] = ['legajo', 'nombre', 'apellido', 'telefono', 'email', 'estado','acciones'];

  seleccionarEmpleado(empleado: any): void {
    console.log('Empleado seleccionado:', empleado.Id);
    
    this.empleadoId = empleado.Id;  
    this.router.navigate(['/employee/edit', empleado.Id]);
  }

  displayEmployeeName(empleado: Empleado): string {
    return empleado ? empleado.nombre: '';
  }

  obtenerEmpleados() {
    this.empleadoService.getEmpleados().subscribe((data: Empleado[]) => {
      console.log(data)
      this.dataSource.data = data;
      this.loading = false
    });
  }

  eliminarEmpleado(empleado: Empleado) {
    const dialogRef = this.dialog.open(ConfirmacionDialogComponent,{
      data:{
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar el empleado "${empleado.apellido} ${empleado.nombre}"?`,
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
            console.error('Error al eliminar el empleado:', err);
            this.mostrarAlerta('Error', 'No se pudo eliminar el empleado.', 'error');
          },
        });
      } else {
        console.log('Operacion de eliminacion cancelada.')
      }
    })
  }
}
