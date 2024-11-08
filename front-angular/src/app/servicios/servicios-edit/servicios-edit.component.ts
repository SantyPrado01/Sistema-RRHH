import { Component, OnInit } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CategoriaServicioService } from '../services/categoria-servicios.service'; 
import { Router, ActivatedRoute } from '@angular/router';
import { response } from 'express';

@Component({
  selector: 'app-empresas-edit',
  standalone: true,
  imports: [NabvarComponent, FormsModule, CommonModule],
  templateUrl: './servicios-edit.component.html',
  styleUrls: ['./servicios-edit.component.css']
})
export class ServiciosEditComponent implements OnInit {

  seccionActual: string = 'datosEmpresa';
  servicio: any = {};
  categorias: any[] = [];
  ciudades: any[] = [];
  provinciaCórdobaId = 14;
  ciudadNombre: string = '';
  servicioId: string | null = null;

  constructor(
    private http: HttpClient,
    private categoriaEmpresaService: CategoriaServicioService,
    private router: Router,
    private route: ActivatedRoute 
  ) {}

  ngOnInit() {
    this.servicioId = this.route.snapshot.paramMap.get('id');

    if (this.servicioId) {
      this.cargarServicio(this.servicioId);
    }
    this.categoriaEmpresaService.getCategoriasServicio().subscribe({
      next: (data) => {
        console.log('Categorías obtenidas:', data);
        this.categorias = data; 
      },
      error: (err) => {
        console.error('Error al obtener las categorías', err);
      }
    });
  }
  
  mostrarSeccion(seccion: string): void {
    this.seccionActual = seccion;
  }

  cargarServicio(id: string) {
    this.http.get<any>(`http://localhost:3000/servicios/${id}`).subscribe({
      next:(data)=>{
        this.servicio = data;
        if (this.servicio.ciudad){
          this.obtenerNombreCiudad(this.servicio.ciudad.toString()).subscribe({
            next: (response) => {
              console.log('Respuesta de la API: ', response);

              if (response.localidades_censales && response.localidades_censales.length > 0) {
                this.ciudadNombre = response.localidades_censales[0].nombre;
                console.log('Nombre de la ciudad encontrado:', this.ciudadNombre);
              } else {
                console.log('localidades_censales está vacío o no existe', response.localidades_censales);
                this.ciudadNombre = 'Desconocido'; 
              }
            },
            error: (err) => {
              console.error('Error al obtener el nombre de la ciudad', err);
              this.ciudadNombre = 'Error';
            }
          });
        } else {
          console.log('ID de ciudad no encontrado:', this.servicio.ciudad);
          this.ciudadNombre = 'Desconocido'; 
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos del empleado', err);
      }
    })
  }

  obtenerNombreCiudad(idCiudad: string) {
    const url = `https://apis.datos.gob.ar/georef/api/localidades-censales?id=${idCiudad}&aplanar=true&campos=nombre&exacto=true`;
    return this.http.get<any>(url);
  }

  buscarCiudad(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value;

    if (query.length > 2) {
      const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${this.provinciaCórdobaId}&nombre=${query}&max=10`;

      this.http.get<any>(url).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
          this.ciudades = response.localidades.map((localidad: any) => {
            return {
              id: localidad.id,
              nombre: localidad.nombre,
            };
          });
        },
        error: (err) => {
          console.error('Error al obtener las ciudades', err);
          this.ciudades = [];
        }
      });
    } else {
      this.ciudades = [];
    }
  }

  seleccionarCiudad(event: any) {
    const selectedCity = this.ciudades.find(c => c.nombre === event.target.value);
    if (selectedCity) {
      this.servicio.ciudad = selectedCity.id; 
      this.ciudadNombre = selectedCity.nombre;
    }
  }

  getCategoriaNombre(id: number): string {
    const categoria = this.categorias.find(c => c.categoria === id);
    console.log(categoria)
    return categoria ? categoria.nombreCategoriaServico : 'Desconocido';
  }

  actualizarEmpresa() {
    const servicioId = this.route.snapshot.paramMap.get('id');
    if (servicioId) {
      this.http.patch<any>(`http://localhost:3000/servicios/${this.servicioId}`, this.servicio).subscribe({
        next: (response) => {
          console.log('Servicio actualizado con éxito:', response);
          alert('Servicio actualizado con éxito');
          this.router.navigate(['/service']);
        },
        error: (err) => {
          console.error('Error al actualizar el Servicio:', err);
        }
      });
    }
  }
  
  cancelar() {
    alert('Servicio NO actualizado, operación cancelada.');
    this.router.navigate(['/service']);
  }
}
