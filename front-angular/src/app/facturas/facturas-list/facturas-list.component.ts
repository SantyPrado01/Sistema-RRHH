import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { FacturaService } from '../services/factura.service';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { FacturaResponse } from '../models/factura.models';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';

@Component({
  selector: 'app-facturas-list',
  standalone: true,
  imports: [NavbarComponent, FormsModule, MatIconModule, CommonModule, RouterModule],
  templateUrl: './facturas-list.component.html',
  styleUrl: './facturas-list.component.css'
})
export class FacturasListComponent implements OnInit{
  filtroEmpresa: string = '';
  facturas: any[] = [];
  facturasFiltradas: FacturaResponse[]=[]
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
    private facturasService: FacturaService  
  ) {}

  ngOnInit(): void {
    this.obtenerFacturas()
  }

  obtenerFacturas(){
    this.facturasService.findAll().subscribe({
      next: (data) =>{
        this.facturas = data
        console.log(data)
        this.filtrarFacturas()
      },
      error: (err) =>{
        console.error('Hubo un error al obtener las órdenes de trabajo', err);
      }
    })
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

  filtrarFacturas() {
    const anioSeleccionado = this.anioSeleccionado;
    const mesSeleccionadoNum = this.mesesMap[this.mesSeleccionado];
    
    this.facturasFiltradas = this.facturas.filter(factura => {
      const [anioFactura, mesFactura] = factura.fecha.split('-');
      
      const mesFacturaNum = Number(mesFactura);
      const anioFacturaNum = Number(anioFactura);
      
      const coincideEmpresa = this.filtroEmpresa
        ? factura.servicio?.nombre?.toLowerCase().includes(this.filtroEmpresa.toLowerCase())
        : true;

      const coincideMes = mesSeleccionadoNum
        ? mesFacturaNum === mesSeleccionadoNum
        : true;
      
      const coincideAnio = anioSeleccionado
        ? anioFacturaNum === anioSeleccionado
        : true;
      
      const coincideEstado = this.estadoSeleccionado !== undefined
        ? (this.estadoSeleccionado ? factura.eliminado === true : factura.eliminado === false)
        : true;
      
      return coincideEmpresa && coincideMes && coincideAnio && coincideEstado;
    });
    
    console.log('Facturas filtradas:', this.facturasFiltradas);
  }  

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

  eliminarFactura(factura: FacturaResponse) {
    const dialogRef = this.dialog.open(ConfirmacionDialogComponent,{
      data:{
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar la factura "${factura.numero} ${factura.servicio.nombre}"?`,
        type: 'confirm'
      }
    });
    dialogRef.afterClosed().subscribe((result) =>{
      if (result){
        const facturaId = Number(factura.facturaId);
        this.facturasService.deleteFactura(facturaId).subscribe({
          next: (response) =>{
            console.log('Factura eliminada con éxito', response);
            this.mostrarAlerta('Operación Exitosa', 'Factura eliminada con éxito.', 'success');
            this.ngOnInit();
          },
          error:(err) => {
            console.error('Error al eliminar la factura:', err);
            this.mostrarAlerta('Error', 'No se pudo eliminar la Factura.', 'error');
          },
        });
      } else {
        console.log('Operacion de eliminacion cancelada.')
      }
    })
  }

}
