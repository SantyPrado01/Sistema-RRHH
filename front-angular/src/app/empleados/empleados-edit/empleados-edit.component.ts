import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoriaEmpleadoService } from '../services/categoria-empleado.service'; 
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Disponibilidad } from '../models/disponibilidad.models';
import { DisponibilidadHorariaService } from '../services/disponibilidad.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-edit-empleado',
  standalone: true,
  templateUrl: './empleados-edit.component.html',
  imports:[NabvarComponent, FormsModule, CommonModule],
  styleUrls: ['./empleados-edit.component.css']
})
export class EditEmpleadoComponent implements OnInit {

  seccionActual: string = 'datosPersonales';
  empleado: any = {};
  categorias: any[] = [];
  ciudades: any[] = [];
  provinciaCórdobaId = 14;
  ciudadNombre: string = '';
  contadorCaracteres: number = 0;

  disponibilidad = [
    { diaSemana: 1, nombre: 'Lunes', horaInicio: '', horaFin: '' },
    { diaSemana: 2, nombre: 'Martes', horaInicio: '', horaFin: '' },
    { diaSemana: 3, nombre: 'Miércoles', horaInicio: '', horaFin: '' },
    { diaSemana: 4, nombre: 'Jueves', horaInicio: '', horaFin: '' },
    { diaSemana: 5, nombre: 'Viernes', horaInicio: '', horaFin: '' },
    { diaSemana: 6, nombre: 'Sábado', horaInicio: '', horaFin: '' },
    { diaSemana: 7, nombre: 'Domingo', horaInicio: '', horaFin: '' }
  ];

  fullTime: boolean = false;

  constructor(
    private http: HttpClient, 
    private categoriaEmpleadoService: CategoriaEmpleadoService,
    private route: ActivatedRoute,
    private router: Router,
    private disponibilidadHorariaService: DisponibilidadHorariaService  
  ) {}

  // Validaciones 

  actualizarContador(event: Event) {
    const inputElement = event.target as HTMLTextAreaElement;
    this.contadorCaracteres = inputElement.value.length;
  }

  validarTelefono(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.empleado.telefono = input.value;
  }

  validarSoloLetras(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^a-zA-Z ]/g, '');
  }

  mostrarSeccion(seccion: string): void {
    this.seccionActual = seccion;
  }

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
      this.cargarDisponibilidad(empleadoId)
    }
  }

  toggleFullTime() {
    if (this.fullTime) {
      this.disponibilidad.forEach(dia => {
        dia.horaInicio = '';
        dia.horaFin = '';
      });
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

  cargarDisponibilidad(empleadoId:string){
    this.http.get<any>(`http://localhost:3000/empleados/${empleadoId}`).subscribe({
      next: (data) => {
        this.empleado = data;
        if (this.empleado.disponibilidades) {
          console.log(this.empleado.disponibilidades)
          this.disponibilidad.forEach(dia => {
            const disp = this.empleado.disponibilidades.find((d: any) => d.diaSemana === dia.diaSemana);
            if (disp) {
              dia.horaInicio = disp.horaInicio;
              dia.horaFin = disp.horaFin;
            }
          });
        }
      }})
  }

  crearDisponibilidad(): void {
    const empleadoId = Number(this.route.snapshot.paramMap.get('id'));
    if (empleadoId) {
        const observables = this.disponibilidad.map(d => {
            const payload = this.fullTime
            
                ? { empleadoId: empleadoId, fullTime: true }  
                : {
                  disponibilidadHorariaId: 0,  // o undefined si no lo estás usando
                  empleadoId: empleadoId,
                  diaSemana: d.diaSemana,
                  horaInicio: d.horaInicio || '',  // Guarda como string vacío si está vacío
                  horaFin: d.horaFin || '',        // Guarda como string vacío si está vacío
                  fullTime: this.fullTime 
                };
                console.log('Datos a guardar:', payload);
            return this.disponibilidadHorariaService.create(payload);
        });

        forkJoin(observables).subscribe({
            next: (respuestas) => {
                console.log('Disponibilidades creadas con éxito:', respuestas);
                alert('Disponibilidades creadas con éxito');
            },
            error: (error) => {
                console.error('Error al crear disponibilidades:', error);
            }
        });
    } else {
        console.error('ID de empleado no proporcionado en la URL.');
    }
}

actualizarDisponibilidad(): void {
  const empleadoId = Number(this.route.snapshot.paramMap.get('id'));
  if (empleadoId) {
    this.empleado.disponibilidades.forEach((d: Disponibilidad) => { 
      if (d.disponibilidadHorariaId) { 
        const payload = {
          empleadoId: empleadoId,
          diaSemana: d.diaSemana,
          horaInicio: d.horaInicio,
          horaFin: d.horaFin,
          fullTime: d.fullTime 
        };

        this.disponibilidadHorariaService.update(d.disponibilidadHorariaId, payload).subscribe({
          next: (respuesta) => {
            console.log(`Disponibilidad actualizada para ${d.horaInicio} - ${d.horaFin}:`, respuesta);
          },
          error: (error) => {
            console.error(`Error al actualizar disponibilidad:`, error);
          }
        });
      } else {
        console.error(`ID de disponibilidad no encontrado para disponibilidad con horarios: ${d.horaInicio} - ${d.horaFin}.`);
      }
    });
  } else {
    console.error('ID de empleado no proporcionado.');
  }
}

  cancelar() {
    alert('Empleado NO actualizado, operación cancelada.');
    this.router.navigate(['/employee']);
  }
}
