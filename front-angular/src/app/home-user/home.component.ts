import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../nabvar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../login/auth/auth.service';
import { OrdenTrabajoService } from '../ordenTrabajo/services/orden-trabajo.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { getSpanishPaginatorIntl } from '../spanish-paginator-intl';
import { ConfirmacionDialogComponent } from '../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
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
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  providers:[
     { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
  ]
})

export class HomeComponent {
  username: string | null = '';
  loading: boolean = false;
  dataSource = new MatTableDataSource<any>([]);
  horasPorMes: any[] = [];
  anioActual: number = new Date().getFullYear();
  completado: boolean = false
  horasProyectadas: string = ''
  horasReales: string = ''
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  mesActual: string = this.meses[new Date().getMonth()];

  private matPaginator!: MatPaginator;
    @ViewChild(MatPaginator) set matPaginatorSetter(mp: MatPaginator) {
      this.matPaginator = mp;
      if (this.dataSource){
        this.dataSource.paginator = this.matPaginator;
        this.matPaginator.firstPage();
      }
    }

  constructor(private authService: AuthService, private ordenTrabajoService: OrdenTrabajoService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.obtenerOrdenes();

  }
  displayedColumns: string[] = ['Id', 'empresa', 'empleado', 'horasProyectadas', 'horasReales', 'estado', 'acciones'];

  ejecutarRenovacionManual() {
  this.loading = true;

  const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
    data: {
      title: 'Confirmar Renovación',
      message: '¿Estás seguro de que deseas ejecutar la renovación de órdenes de trabajo?',
      type: 'warning',
      showCancel: true
    },
    disableClose: true
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.ordenTrabajoService.ejecutarRenovacionManual().subscribe({
        next: (data) => {
          this.loading = false;
          this.completado = true;
          console.log('Renovación manual ejecutada correctamente:', data);
          this.obtenerOrdenes();
        },
        error: (error) => {
          this.loading = false;
          console.error('Error al ejecutar la renovación manual:', error);
        }
      });
    } else {
      this.loading = false; // canceló, por lo tanto detenemos el loading
    }
  });
}


  obtenerOrdenes() {
    this.loading = true;
    const mesNumero = new Date().getMonth() + 1;
    this.ordenTrabajoService.getHorasPorMes(mesNumero, this.anioActual).subscribe(
      (data) => {
        this.horasProyectadas = data.horasProyectadas;
        this.horasReales = data.horasReales;
      }
    )
    this.ordenTrabajoService.getOrdenesPorMesAnio(mesNumero, this.anioActual).subscribe(
      (data) => {
        this.dataSource.data = data.ordenes;
        this.loading = false
        console.log('Órdenes de trabajo obtenidas:', data);
      },
      (error) => {
        console.error('Hubo un error al obtener las órdenes de trabajo', error);
      }
    );
  }

  obtenerDias(necesidades: any[]): string {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'];
    const diasConHorario = necesidades
      .filter(n => n.horaInicio !== "00:00:00" && n.horaFin !== "00:00:00")
      .map(n => diasSemana[parseInt(n.diaSemana, 10) - 1]) 
      .filter((dia, index, self) => dia && self.indexOf(dia) === index);
    return diasConHorario.join(', ') || 'No hay días con horarios definidos';
  }

  truncateToTwoDecimals(value: number): string {
    return Math.floor(value * 100) / 100 + ''; 
  }
}
