import { Component, OnInit } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Empresa } from '../models/servicio.models';
import { ServicioService } from '../services/servicio.service';
import { CategoriaEmpleadoService } from '../../empleados/services/categoria-empleado.service';

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
  ciudades: any[] = [];
  provinciaCórdobaId: number = 14;

  constructor(
    private servicioService: ServicioService, 
    private router: Router, 
    private http: HttpClient,
    private categoria: CategoriaEmpleadoService
  ) {}

  ngOnInit(): void {
    this.obtenerServicios();
    this.obtenerCategorias();
  }

  obtenerServicios(): void {
    this.servicioService.getServicios().subscribe((data: Empresa[]) => {
      this.empresas = data;
      this.filtrarServicios();
    });
  }

  obtenerCategorias(): void {
    this.categoria.getCategoriasEmpleados().subscribe((data: any[]) => {
      this.categorias = data;
    });
  }

  getCategoriaNombre(id: number): string {
    const categoria = this.categorias.find(c => c.idCategoria === id);
    return categoria ? categoria.nombreCategoria : 'Desconocido';
  }

  buscarServicios(): void {
    this.filtrarServicios()
  }

  filtrarServicios(): void {
    this.empresasFiltradas = this.empresas
      .filter(empresa => 
        !empresa.eliminado && 
        (empresa.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()))
      )
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
