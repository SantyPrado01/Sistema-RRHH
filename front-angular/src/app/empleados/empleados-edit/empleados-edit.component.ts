import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Empleado } from '../models/empleado.models';
import { HttpClient } from '@angular/common/http';
import { CategoriaEmpleadoService } from '../services/categoria-empleado.service'; 
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


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
    // Obtener las categorías de empleados
    this.categoriaEmpleadoService.getCategoriasEmpleados().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener las categorías', err);
      }
    });

    // Obtener el ID del empleado de la URL
    const empleadoId = this.route.snapshot.paramMap.get('id');
    if (empleadoId) {
      // Obtener el empleado a editar desde la API
      this.http.get<Empleado>(`http://localhost:3000/empleados/${empleadoId}`).subscribe({
        next: (data) => {
          this.empleado = data;
          // Setear el nombre de la ciudad (esto podría venir del backend)
          const ciudadSeleccionada = this.ciudades.find(c => c.id === this.empleado.ciudad);
          this.ciudadNombre = ciudadSeleccionada ? ciudadSeleccionada.nombre : '';
        },
        error: (err) => {
          console.error('Error al cargar los datos del empleado', err);
        }
      });
    }
  }

  buscarCiudad(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value;

    if (query.length > 2) {
      const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${this.provinciaCórdobaId}&nombre=${query}&max=10`;

      this.http.get<any>(url).subscribe({
        next: (response) => {
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
      this.empleado.ciudad = selectedCity.id;
    }
  }

  actualizarEmpleado() {
    const empleadoId = this.route.snapshot.paramMap.get('id');
    console.log('ID del empleado:', empleadoId);
    this.http.patch<Empleado>(`http://localhost:3000/empleados/${empleadoId}`, this.empleado).subscribe({
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

  cancelar() {
    alert('Empleado NO actualizado, operacion cancelada.');
    this.router.navigate(['/employee']);
  }
}
