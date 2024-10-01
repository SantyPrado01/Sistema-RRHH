import { Component, OnInit } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Empresa } from '../models/servicio.models';
import { ServicioService } from '../services/servicio.service';
import { CategoriaEmpleadoService } from '../../empleados/services/categoria-empleado.service';
import { catchError, forkJoin, map, of } from 'rxjs';
import { CategoriaServicioService } from '../services/categoria-servicios.service';

@Component({
  selector: 'app-servicios-list',
  standalone: true,
  imports: [NabvarComponent, CommonModule, RouterModule],
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
  provincias: any[] = []; // Cambié a plural si necesitas más provincias
  provinciaCórdobaId: number = 14;

  constructor(
    private servicioService: ServicioService, 
    private router: Router, 
    private http: HttpClient,
    private categoria: CategoriaServicioService
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

        // Crea un array de observables para las llamadas a obtenerNombreCiudad
        const ciudadRequests = this.empresas.map(empresa => {
            if (empresa.ciudad) {
                return this.obtenerNombreCiudad(empresa.ciudad.toString()).pipe(
                    // Agrega un manejo para mapear la respuesta
                    map(response => {
                        const nombreCiudad = response.localidades_censales[0]?.nombre || 'Desconocido';
                        empresa.ciudad = nombreCiudad; // Actualiza el nombre de la ciudad
                        return empresa; // Devuelve la empresa actualizada
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

        // Usa forkJoin para esperar todas las llamadas
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
        console.log('Categorías cargadas:', this.categorias); // Agregar este log
    });
}

  getCategoriaNombre(id: number): string {
    const categoria = this.categorias.find(c => c.idCategoria === id);
    return categoria ? categoria.nombreCategoria : 'Desconocido';
  }

  buscarServicios(): void {
    this.filtrarServicios();
  }

  filtrarServicios(): void {
    this.empresasFiltradas = this.empresas
      .filter(empresa => 
        !empresa.eliminado && 
        (empresa.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
  }

  eliminarServicio(empresa: Empresa): void {
    if (confirm('¿Estás seguro de que deseas marcar a esta empresa como inactiva?')) {
      const empresaId = empresa.servicioId;

      this.http.patch<Empresa>(`http://localhost:3000/servicio/${empresaId}`, { eliminado: true }).subscribe({
        next: (response) => {
          console.log('Servicio eliminada con éxito:', response);
          alert('Servicio eliminada con éxito');
          this.router.navigate(['/service']); // Asegúrate de que la ruta sea correcta
        },
        error: (err) => {
          console.log('ID de la empresa:', empresaId);
          console.error('Error al eliminar la empresa:', err);
        }
      });
    } else {
      console.log('Operación cancelada');
    }
  }
}

