import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-servicios-list',
  standalone: true,
  imports: [
    NavbarComponent, 
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule
  ],
  templateUrl: './servicios-list.component.html',
  styleUrls: ['./servicios-list.component.css'] 
})
export class ServiciosListComponent implements OnInit {
  empresas: Empresa[] = [];
  dataSource: MatTableDataSource<Empresa>;
  displayedColumns: string[] = ['nombre', 'telefono', 'ciudad', 'categoria', 'acciones'];
  searchTerm: string = '';
  categorias: any[] = [];
  filtroVisualizar: string = 'activo';  
  filtroOrdenar: string = 'nombre';     
  isModalOpen: boolean = false;
  provincias: any[] = []; 
  provinciaCórdobaId: number = 14;
  selectedTabIndex: number = 0; // Para el control de tabs

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private servicioService: ServicioService, 
    private router: Router, 
    private http: HttpClient,
    private categoria: CategoriaServicioService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Empresa>([]);
  }

  ngOnInit(): void {
    this.buscarServicios();
    this.obtenerServicios();
    this.obtenerCategorias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar ordenamiento personalizado
    this.dataSource.sortingDataAccessor = (item: Empresa, property: string): string | number => {
      switch(property) {
        case 'categoria': return item.categoria?.nombre || '';
        case 'nombre': return item.nombre || '';
        case 'telefono': return item.telefono || '';
        case 'ciudad': return item.ciudad || '';
        default: {
          const value = item[property as keyof Empresa];
          if (typeof value === 'string' || typeof value === 'number') {
            return value;
          }
          return '';
        }
      }
    };

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: Empresa, filter: string) => {
      return data.nombre.toLowerCase().includes(filter.toLowerCase());
    };
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  obtenerServicios(): void {
    this.servicioService.getServicios().subscribe((data: Empresa[]) => {
      this.empresas = data;
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
        this.actualizarTablaSegunFiltros();
      });
    });
  }

  actualizarTablaSegunFiltros() {
    const empresasFiltradas = this.empresas.filter(empresa => {
      const coincideEstado = this.filtroVisualizar === 'activo' ? !empresa.eliminado : empresa.eliminado;
      return coincideEstado;
    });

    // Aplicar ordenamiento
    if (this.filtroOrdenar === 'nombre') {
      empresasFiltradas.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (this.filtroOrdenar === 'categoria') {
      empresasFiltradas.sort((a, b) => a.categoria.nombre.localeCompare(b.categoria.nombre));
    }

    this.dataSource.data = empresasFiltradas;
  }

  onTabChange(event: any) {
    this.selectedTabIndex = event.index;
    this.actualizarTablaSegunFiltros();
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
    this.actualizarTablaSegunFiltros();
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

