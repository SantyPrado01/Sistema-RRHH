import { Component, OnInit } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { Empleado } from '../models/empleado.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CategoriaEmpleadoService } from '../services/categoria-empleado.service'; 
import { Router } from '@angular/router';


@Component({
  selector: 'app-empleados-new',
  standalone: true,
  imports: [NabvarComponent, FormsModule, CommonModule],
  templateUrl: './empleados-new.component.html',
  styleUrls: ['./empleados-new.component.css']
})
export class EmpleadosNewComponent implements OnInit{

  empleado: Empleado = {
    empleadoId: 0,
    legajo: 0,
    nombre: '',
    apellido: '',
    nroDocumento: 0,
    telefono: 0,
    email: '',
    fechaIngreso: undefined,
    eliminado: false,
    observaciones:'',
    ciudad:0,
    categoria: 0,
    disponibilidadID: 0,
  };

  categorias: any[] = []
  ciudades: any[] = [];
  provinciaCórdobaId = 14;
  ciudadNombre: string = '';

  constructor(private http: HttpClient, private categoriaEmpleadoService: CategoriaEmpleadoService, private router: Router) {}

  ngOnInit() {
    this.categoriaEmpleadoService.getCategoriasEmpleados().subscribe({
      next: (data) => {
        console.log('Categorías obtenidas:', data);
        this.categorias = data; // Asignar los datos de las categorías obtenidos desde el back-end
      },
      error: (err) => {
        console.error('Error al obtener las categorías', err);
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
      this.empleado.ciudad = selectedCity.id; 
    }
  }
  
  guardarEmpleado() {
    const url = 'http://localhost:3000/empleados'; // URL del endpoint para guardar empleados
    this.http.post(url, this.empleado).subscribe({
      next: (response) => {
        console.log('Empleado guardado con éxito:', response);
        // Mostrar un mensaje de éxito
        alert('Empleado guardado con éxito');
        // Limpiar los campos del formulario
        this.limpiarFormulario();
        this.router.navigate(['/empleados']);
      },
      error: (err) => {
        console.error('Error al guardar el empleado:', err);
      }
    });
  }

  limpiarFormulario() {
    this.empleado = {
      empleadoId: 0,
      legajo: 0,
      nombre: '',
      apellido: '',
      nroDocumento: 0,
      telefono: 0,
      email: '',
      fechaIngreso: undefined,
      eliminado: false,
      ciudad: 12112120,
      categoria: 0,
      disponibilidadID: 0,
      observaciones:''
    };
  }
  
  
  cancelar() {
    // Lógica para cancelar el registro
  }
}
