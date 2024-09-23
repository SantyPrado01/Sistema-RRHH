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

    this.obtenerCiudades();

    // Obtener el ID del empleado de la URL y luego cargar el empleado
    const empleadoId = this.route.snapshot.paramMap.get('id');
    if (empleadoId) {
      this.cargarEmpleado(empleadoId);
    }
  }

  obtenerCiudades() {
    const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${this.provinciaCórdobaId}`; // Ajusta max según necesidad

    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.ciudades = response.localidades.map((localidad: any) => ({
          id: localidad.id,
          nombre: localidad.nombre,
        }));
      },
      error: (err) => {
        console.error('Error al obtener las ciudades', err);
      }
    });
  }

  cargarEmpleado(empleadoId: string) {
    this.http.get<any>(`http://localhost:3000/empleados/${empleadoId}`).subscribe({
      next: (data) => {
        this.empleado = data;
        // Setear el nombre de la ciudad basado en el ID
        const ciudadSeleccionada = this.ciudades.find(c => c.id === this.empleado.ciudad);
        this.ciudadNombre = ciudadSeleccionada ? ciudadSeleccionada.nombre : '';
      },
      error: (err) => {
        console.error('Error al cargar los datos del empleado', err);
      }
    });
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
