import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-listar-orden-trabajo',
  standalone: true,
  imports: [NavbarComponent, FormsModule, MatIconModule, CommonModule, RouterModule],
  templateUrl: './listar-orden-trabajo.component.html',
  styleUrl: './listar-orden-trabajo.component.css'
})
export class ListarOrdenTrabajoComponent implements OnInit {
  filtroEmpresa: string = '';
  ordenes: any[] = [];
  ordenesFiltradas: any[] = [];
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => 2024 + i);
  anioSeleccionado: number = new Date().getFullYear(); 
  mesSeleccionado: number = new Date().getMonth() + 1; 
  estadoSeleccionado: boolean = false;

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private ordenTrabajoService: OrdenTrabajoService  
  ) {}

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

  ngOnInit(): void {
    this.obtenerOrdenes()
  }

  obtenerOrdenes() {
    this.ordenTrabajoService.getAll().subscribe({
      next: (data) => {
        this.ordenes = data;
        this.ordenesFiltradas = data
        console.log('Órdenes obtenidas:', this.ordenesFiltradas);
      },
      error: (err) => {
        console.error('Hubo un error al obtener las órdenes de trabajo', err);
      }
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
    const anioSeleccionado = Number(this.anioSeleccionado);
    const mesSeleccionadoNum = this.mesesMap[this.mesSeleccionado];
    
    this.ordenesFiltradas = this.ordenes.filter(orden => {
      const coincideEmpresa = this.filtroEmpresa
        ? orden.servicio.nombre && orden.servicio.nombre.toLowerCase().includes(this.filtroEmpresa.toLowerCase())
        : true;

      const coincideMes = mesSeleccionadoNum
      ? orden.mes === mesSeleccionadoNum
      : true;

      const coincideAnio = this.anioSeleccionado
      ? orden.anio === anioSeleccionado
      : true;

      const coincideEstado = this.estadoSeleccionado !== undefined
        ? (this.estadoSeleccionado === true ? orden.completado === true : orden.completado === false)
        : true;
      return coincideEmpresa && coincideMes && coincideAnio && coincideEstado;
    });
  
    console.log('Órdenes filtradas:', this.ordenesFiltradas);
  }

  eliminarOrden(orden: OrdenTrabajo){
    console.log(orden)
    const dialogRef = this.dialog.open(ConfirmacionDialogComponent,{
      data:{
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar la Orden "${orden.Id}" y sus horarios asignados?`,
        type: 'confirm'
      }
    });
    dialogRef.afterClosed().subscribe((result) =>{
      if (result){
        const ordenId = Number(orden.Id);
        console.log(ordenId)
        this.ordenTrabajoService.eliminarOrden(ordenId).subscribe({
          next: (response) =>{
            console.log('Orden de Trabajo eliminada con éxito', response);
            this.mostrarAlerta('Operación Exitosa', 'Orden de Trabajo eliminada con éxito.', 'success');
            this.ngOnInit();
          },
          error:(err) => {
            console.error('Error al eliminar la Orden:', err);
            this.mostrarAlerta('Error', 'No se pudo eliminar la Orden de Trabajo.', 'error');
          },
        });
      } else {
        console.log('Operacion de eliminacion cancelada.')
      }
    })
  }

  truncateToTwoDecimals(value: number): string {
    return Math.floor(value * 100) / 100 + ''; 
  }

}
