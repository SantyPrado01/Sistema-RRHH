import { Component } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { Empleado } from '../models/empleado.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-empleados-new',
  standalone: true,
  imports: [NabvarComponent, FormsModule, CommonModule],
  templateUrl: './empleados-new.component.html',
  styleUrls: ['./empleados-new.component.css']
})
export class EmpleadosNewComponent {

  empleado: Empleado = {
    legajo: 0,
    nombre: '',
    apellido: '',
    nroDocumento: 0,
    telefono: 0,
    email: '',
    fechaIngreso: undefined,
    eliminado: false,
    categoriasID: 0,
    disponibilidadID: 0,
    ciudadID: 0
  };

  categorias = [
    { id: 1, nombre: 'Administración' },
    { id: 2, nombre: 'Ventas' },
    { id: 3, nombre: 'Soporte Técnico' }
  ];

  ciudades: any[] = [];
  provinciaCórdobaId = 14;

  constructor(private http: HttpClient) {}

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

  guardarEmpleado() {
    // Lógica para guardar el empleado
  }
  
  cancelar() {
    // Lógica para cancelar el registro
  }
}
