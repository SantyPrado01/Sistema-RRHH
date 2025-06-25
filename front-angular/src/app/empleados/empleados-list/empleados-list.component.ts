import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { EmpleadoService } from '../services/empleado.service';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    AlertDialogComponent,
    ConfirmacionDialogComponent
  ],
  templateUrl: './empleados-list.component.html',
  styleUrls: ['./empleados-list.component.css']
})
export class EmpleadosListComponent implements OnInit {
  displayedColumns: string[] = ['legajo','nombre', 'apellido', 'telefono', 'email', 'estado', 'acciones'];
  dataSource: MatTableDataSource<any>;
  empleadosOriginales: any[] = [];
  estadoSeleccionado: 'todos' | 'activos' | 'eliminados' = 'activos';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private empleadoService: EmpleadoService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.cargarEmpleados();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarEmpleados() {
    this.empleadoService.getEmpleados().subscribe({
      next: (data) => {
        this.empleadosOriginales = data;
        this.filtrarEmpleados();
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
        this.mostrarAlerta('Error', 'No se pudieron cargar los empleados', 'error');
      }
    });
  }

  filtrarEmpleados() {
    let empleadosFiltrados = [...this.empleadosOriginales];

    // Aplicar filtro de estado
    switch (this.estadoSeleccionado) {
      case 'activos':
        empleadosFiltrados = empleadosFiltrados.filter(emp => !emp.eliminado);
        break;
      case 'eliminados':
        empleadosFiltrados = empleadosFiltrados.filter(emp => emp.eliminado);
        break;
      // 'todos' no necesita filtro
    }

    // Aplicar filtro de búsqueda si existe
    const filterValue = this.dataSource.filter;
    if (filterValue) {
      empleadosFiltrados = empleadosFiltrados.filter(emp => 
        emp.nombre.toLowerCase().includes(filterValue.toLowerCase()) ||
        emp.apellido.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    this.dataSource.data = empleadosFiltrados;
  }

  onEstadoChange() {
    this.filtrarEmpleados();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.filtrarEmpleados();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  eliminarEmpleado(empleado: any) {
    const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
      data: {
        title: 'Confirmar eliminación',
        message: '¿Está seguro de que desea eliminar este empleado?',
        type: 'confirm'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empleadoService.deleteEmpleado(empleado.Id).subscribe({
          next: () => {
            this.mostrarAlerta('Éxito', 'Empleado eliminado correctamente', 'success');
            this.cargarEmpleados();
          },
          error: (error) => {
            console.error('Error al eliminar empleado:', error);
            this.mostrarAlerta('Error', 'No se pudo eliminar el empleado', 'error');
          }
        });
      }
    });
  }

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error') {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo }
    });
  }
}
