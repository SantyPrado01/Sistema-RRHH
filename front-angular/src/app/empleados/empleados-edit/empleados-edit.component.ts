import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoriaEmpleadoService } from '../services/categoria-empleado.service'; 
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-empleado',
  standalone: true,
  templateUrl: './empleados-edit.component.html',
  imports:[NabvarComponent, FormsModule, CommonModule],
  styleUrls: ['./empleados-edit.component.css']
})
export class EditEmpleadoComponent implements OnInit {

  empleado: any = {};
  categorias: any[] = [];
  ciudades: any[] = [];
  provinciaCórdobaId = 14;
  ciudadNombre: string = '';

  constructor(
    private http: HttpClient, 
    private categoriaEmpleadoService: CategoriaEmpleadoService,
    private route: ActivatedRoute,
    private router: Router  
  ) {}

  ngOnInit() {
    this.categoriaEmpleadoService.getCategoriasEmpleados().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener las categorías', err);
      }
    });
    // Obtener el ID del empleado de la URL y luego cargar el empleado
    const empleadoId = this.route.snapshot.paramMap.get('id');
    if (empleadoId) {
      this.cargarEmpleado(empleadoId);
    }
  }

  cargarEmpleado(empleadoId: string) {
    this.http.get<any>(`http://localhost:3000/empleados/${empleadoId}`).subscribe({
      next: (data) => {
        this.empleado = data;
  
        if (this.empleado.ciudad) {
          this.obtenerNombreCiudad(this.empleado.ciudad.toString()).subscribe({
            next: (response) => {
              console.log('Respuesta de la API:', response);
              
              // Verifica que la propiedad localidades_censales esté presente
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
          console.log('ID de ciudad no encontrado:', this.empleado.ciudad);
          this.ciudadNombre = 'Desconocido'; 
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos del empleado', err);
      }
    });
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
          this.ciudades = response.localidades.map((localidad: any) => ({
            id: localidad.id,
            nombre: localidad.nombre,
          }));
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
      this.empleado.ciudad = selectedCity.id;
      this.ciudadNombre = selectedCity.nombre; // Actualiza el nombre de la ciudad cuando se selecciona
    }
  }

  actualizarEmpleado() {
    const empleadoId = this.route.snapshot.paramMap.get('id');
    if (empleadoId) {
      this.http.patch<any>(`http://localhost:3000/empleados/${empleadoId}`, this.empleado).subscribe({
        next: (response) => {
          console.log('Empleado actualizado con éxito:', response);
          alert('Empleado actualizado con éxito');
          this.router.navigate(['/employee']);
        },
        error: (err) => {
          console.error('Error al actualizar el empleado:', err);
        }
      });
    }
  }

  cancelar() {
    alert('Empleado NO actualizado, operación cancelada.');
    this.router.navigate(['/employee']);
  }
}
