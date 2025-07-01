import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OrdenTrabajoService } from '../services/orden-trabajo.service';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { MatIconModule } from '@angular/material/icon';
import { OrdenTrabajo } from '../models/orden-trabajo.models';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-listar-orden-trabajo',
  standalone: true,
  imports: [
    NavbarComponent, 
    FormsModule, 
    MatIconModule, 
    CommonModule, 
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatExpansionModule
  ],
  templateUrl: './listar-orden-trabajo.component.html',
  styleUrl: './listar-orden-trabajo.component.css'
})
export class ListarOrdenTrabajoComponent implements OnInit {
  dataSource: MatTableDataSource<OrdenTrabajo>;
  displayedColumns: string[] = ['id', 'empresa','fechaInicio', 'fechaFin' ,'mes', 'anio', 'estado', 'horasProyectadas', 'horasReales', 'eliminado', 'acciones'];
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + i - 5); // 5 años atrás y 5 años adelante
  
  estadoSeleccionado: boolean | null = null;
  mesSeleccionado: number | null = null;
  anioSeleccionado: number | null = null;
  ordenesOriginales: OrdenTrabajo[] = [];

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private ordenTrabajoService: OrdenTrabajoService  
  ) {
    this.dataSource = new MatTableDataSource<OrdenTrabajo>([]);
  }

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar ordenamiento personalizado
    this.dataSource.sortingDataAccessor = (item: OrdenTrabajo, property: string) => {
      switch(property) {
        case 'empresa': return item.servicio.nombre;
        case 'mes': return item.mes;
        case 'anio': return item.anio;
        default: return (item as any)[property];
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

  cargarOrdenes() {
    this.ordenTrabajoService.getAll().subscribe({
      next: (ordenes) => {
        this.ordenesOriginales = ordenes;
        this.dataSource.data = ordenes;
        console.log('Órdenes cargadas:', this.dataSource.data);
        this.filtrarOrdenes();
      },
      error: (error) => {
        console.error('Error al cargar órdenes:', error);
        this.mostrarAlerta('Error', 'No se pudieron cargar las órdenes de trabajo', 'error');
      }
    });
  }

  getMesNombre(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1];
  }

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error' | 'warning'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo }
    });
  }

  obtenerDias(necesidades: any[]): string {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'];
    const diasConHorario = necesidades
      .filter(n => n.horaInicio !== "00:00:00" && n.horaFin !== "00:00:00")
      .map(n => diasSemana[parseInt(n.diaSemana, 10) - 1]) 
      .filter((dia, index, self) => dia && self.indexOf(dia) === index);
    return diasConHorario.join(', ') || 'No hay días con horarios definidos';
  }

  mesesMap: { [key: string]: number } = {
    'Enero': 1,
    'Febrero': 2,
    'Marzo': 3,
    'Abril': 4,
    'Mayo': 5,
    'Junio': 6,
    'Julio': 7,
    'Agosto': 8,
    'Septiembre': 9,
    'Octubre': 10,
    'Noviembre': 11,
    'Diciembre': 12
  };

  filtrarOrdenes() {
    let ordenesFiltradas = [...this.ordenesOriginales];

    // Filtrar por estado
    if (this.estadoSeleccionado !== null) {
      ordenesFiltradas = ordenesFiltradas.filter(orden => orden.completado === this.estadoSeleccionado);
    }

    // Filtrar por mes
    if (this.mesSeleccionado !== null) {
      ordenesFiltradas = ordenesFiltradas.filter(orden => orden.mes === this.mesSeleccionado);
    }

    // Filtrar por año
    if (this.anioSeleccionado !== null) {
      ordenesFiltradas = ordenesFiltradas.filter(orden => orden.anio === this.anioSeleccionado);
    }

    // Filtrar por nombre de empresa
    const filterValue = (document.getElementById('empresaFilter') as HTMLInputElement)?.value?.toLowerCase() || '';
    if (filterValue) {
      ordenesFiltradas = ordenesFiltradas.filter(orden => 
        orden.servicio.nombre.toLowerCase().includes(filterValue)
      );
    }

    this.dataSource.data = ordenesFiltradas;
  }

  // Método para manejar el cambio en el filtro de empresa
  onEmpresaFilterChange() {
    this.filtrarOrdenes();
  }

  eliminarOrden(orden: OrdenTrabajo) {
    console.log('Estado de eliminación de la orden:', orden.eliminado);
    
    if (orden.eliminado) {
      console.log('Intentando eliminación definitiva');
      const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
        data: {
          title: 'Confirmar eliminación definitiva',
          message: 'Esta orden ya está marcada como eliminada. ¿Desea eliminarla definitivamente del sistema? Esta acción no se puede deshacer.',
          type: 'warning',
          showCancel: true
        },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Resultado del diálogo (eliminación definitiva):', result);
        if (result) {
          console.log('Iniciando eliminación definitiva de la orden:', orden.Id);
          this.ordenTrabajoService.eliminarOrdenDef(orden.Id).subscribe({
            next: (response) => {
              console.log('Respuesta de eliminación definitiva:', response);
              this.mostrarAlerta('Éxito', 'Orden eliminada definitivamente del sistema', 'success');
              this.cargarOrdenes();
            },
            error: (error) => {
              console.error('Error al eliminar orden definitivamente:', error);
              this.mostrarAlerta('Error', 'No se pudo eliminar la orden', 'error');
            }
          });
        }
      });
    } else {
      console.log('Intentando eliminación lógica');
      const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
        data: {
          title: 'Confirmar eliminación',
          message: '¿Está seguro que desea marcar esta orden como eliminada?',
          type: 'warning',
          showCancel: true
        },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log('Resultado del diálogo (eliminación lógica):', result);
        if (result) {
          console.log('Iniciando eliminación lógica de la orden:', orden.Id);
          this.ordenTrabajoService.eliminarOrden(orden.Id).subscribe({
            next: (response) => {
              console.log('Respuesta de eliminación lógica:', response);
              this.mostrarAlerta('Éxito', 'Orden marcada como eliminada', 'success');
              this.cargarOrdenes();
            },
            error: (error) => {
              console.error('Error al marcar orden como eliminada:', error);
              this.mostrarAlerta('Error', 'No se pudo marcar la orden como eliminada', 'error');
            }
          });
        }
      });
    }
  }

  truncateToTwoDecimals(value: number): string {
    return Math.floor(value * 100) / 100 + ''; 
  }
}
