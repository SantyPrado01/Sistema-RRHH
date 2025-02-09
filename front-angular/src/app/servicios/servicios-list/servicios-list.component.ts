import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Empresa } from '../models/servicio.models';
import { ServicioService } from '../services/servicio.service';
import { catchError, forkJoin, map, of } from 'rxjs';
import { CategoriaServicioService } from '../services/categoria-servicios.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';


@Component({
  selector: 'app-servicios-list',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule, MatIconModule, FormsModule],
  templateUrl: './servicios-list.component.html',
  styleUrls: ['./servicios-list.component.css'] 
})
export class ServiciosListComponent implements OnInit {
  empresas: Empresa[] = [];
  empresasFiltradas: Empresa[] = [];
  searchTerm: string = '';
  categorias: any[] = [];
  filtroVisualizar: string = 'activo';  
  filtroOrdenar: string = 'nombre';     
  isModalOpen: boolean = false;
  provincias: any[] = []; 
  provinciaCórdobaId: number = 14;

  constructor(
    private servicioService: ServicioService, 
    private router: Router, 
    private http: HttpClient,
    private categoria: CategoriaServicioService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.buscarServicios();
    this.obtenerServicios();
    this.obtenerCategorias();
  }

  obtenerServicios(): void {
    this.servicioService.getServicios().subscribe((data: Empresa[]) => {
        this.empresas = data;
        console.log(data)
        const ciudadRequests = this.empresas.map(empresa => {
            if (empresa.ciudad) {
                return this.obtenerNombreCiudad(empresa.ciudad.toString()).pipe(
                    map(response => {
                        const nombreCiudad = response.localidades_censales[0]?.nombre || 'Desconocido';
                        empresa.ciudad = nombreCiudad; 
                        return empresa; 
                    }),
                    catchError(() => {
                        console.error('Error al obtener el nombre de la ciudad');
                        return of(empresa); 
                    })
                );
            } else {
                return of(empresa);
            }
        });

        forkJoin(ciudadRequests).subscribe((empresasActualizadas) => {
            this.empresas = empresasActualizadas; 
            this.filtrarServicios(); 
        });
    });
  }

  obtenerNombreCiudad(idCiudad: string) {
    const url = `https://apis.datos.gob.ar/georef/api/localidades-censales?id=${idCiudad}&aplanar=true&campos=nombre&exacto=true`;
    return this.http.get<any>(url);
  }

  obtenerCategorias(): void {
    this.categoria.getCategoriasServicio().subscribe((data: any[]) => {
        this.categorias = data;
    });
}

  buscarServicios(): void {
    this.filtrarServicios();
  }

  filtrarServicios(): void {
    this.empresasFiltradas = this.empresas.filter(empresa => {
      const coincideEstado = this.filtroVisualizar === 'activo' ? !empresa.eliminado : empresa.eliminado;
      if (!coincideEstado) return false;
      const coincideNombre = empresa.nombre.toLowerCase().includes(this.searchTerm.toLowerCase());
      return coincideNombre;
    });
    if (this.filtroOrdenar === 'nombre') {
      this.empresasFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (this.filtroOrdenar === 'categoria') {
      
    }
  }
  
  eliminarServicio(empresa: Empresa): void {
    const dialogRef = this.dialog.open(ConfirmacionDialogComponent,{
      data:{
        title:'Confirmar Eliminación',
        message:`¿Estás seguro de que deseas eliminar la Empresa "${empresa.nombre}"?`,
        type: 'confirm',
      },
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if (result){
        const empresaId = Number(empresa.servicioId);
        this.servicioService.deleteServicio(empresaId).subscribe({
          next: (response) =>{
            console.log('Empresa eliminada con éxito:', response)
            this.mostrarAlerta('Operación Exitosa', 'Empresa eliminada con éxito.', 'success')
            this.ngOnInit();
          },
          error:(err) =>{
            console.log('ID de la empresa:', empresaId);
            console.error('Error al eliminar la empresa:', err);
          }
        });
      } else {
        console.log('Operación cancelada');
      }
    })
  }

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }
}

