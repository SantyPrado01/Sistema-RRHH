import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    AlertDialogComponent,
    ConfirmacionDialogComponent
  ],
  templateUrl: './empleados-list.component.html',
  styleUrls: ['./empleados-list.component.css']
})
export class EmpleadosListComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'apellido', 'telefono', 'email', 'estado', 'acciones'];
  dataSource: MatTableDataSource<any>;

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
        this.dataSource.data = data;
        console.log(this.dataSource.data);
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
        this.mostrarAlerta('Error', 'No se pudieron cargar los empleados', 'error');
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

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
        this.empleadoService.deleteEmpleado(empleado.empleadoId).subscribe({
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
