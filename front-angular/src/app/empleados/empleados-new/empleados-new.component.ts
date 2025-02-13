import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CategoriaEmpleadoService } from '../services/categoria-empleado.service'; 
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { EmpleadoService } from '../services/empleado.service';


@Component({
  selector: 'app-empleados-new',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, MatDialogModule],
  templateUrl: './empleados-new.component.html',
  styleUrls: ['./empleados-new.component.css']
})
export class EmpleadosNewComponent implements OnInit{

  seccionActual: string = 'datosPersonales';
  empleado: any = {};
  categorias: any[] = [];
  ciudades: any[] = [];
  provinciaCórdobaId = 14;
  provinciaSanLuisId = 74;
  provinciaTucumanId = 90;
  provinciaCatamarcaId = 10;
  provinciaLaRiojaId = 46;
  ciudadNombre: string = '';
  contadorCaracteres: number = 0;

  disponibilidad = [
    { diaSemana: 1, nombre: 'Lunes', horaInicio: '', horaFin: '' },
    { diaSemana: 2, nombre: 'Martes', horaInicio: '', horaFin: '' },
    { diaSemana: 3, nombre: 'Miércoles', horaInicio: '', horaFin: ''},
    { diaSemana: 4, nombre: 'Jueves', horaInicio: '', horaFin: ''},
    { diaSemana: 5, nombre: 'Viernes', horaInicio: '', horaFin: ''},
    { diaSemana: 6, nombre: 'Sábado', horaInicio: '', horaFin: ''},
    { diaSemana: 7, nombre: 'Domingo', horaInicio: '', horaFin: ''}
  ];
  fullTime: boolean = true;

  constructor(
    private http: HttpClient, 
    private empleadoService: EmpleadoService,
    private categoriaEmpleadoService: CategoriaEmpleadoService, 
    private router: Router, 
    private dialog: MatDialog
  ) {}

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

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
        console.log('Categorías obtenidas:', data);
        this.categorias = data; 
      },
      error: (err) => {
        console.error('Error al obtener las categorías', err);
      }
    });
  }

  toggleFullTime() {
    if (this.fullTime) {
      this.disponibilidad.forEach(dia => {
        dia.horaInicio = '';
        dia.horaFin = '';
      });
    }
  }

  buscarCiudad(event: Event) {
    const input = event.target as HTMLInputElement;
    const query = input.value;

    if (query.length > 2) {
      const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${this.provinciaCórdobaId},${this.provinciaSanLuisId},${this.provinciaTucumanId},${this.provinciaCatamarcaId},${this.provinciaLaRiojaId}&nombre=${query}&max=10`;

      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.ciudades = response.localidades.map((localidad: any) => {
            return {
              id: localidad.localidad_censal.id,
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
    console.log(selectedCity)
    this.empleado.ciudad = selectedCity.id; 
    this.ciudadNombre = selectedCity.nombre;
  }
  
  guardarEmpleado() {
    this.empleado.disponibilidades = this.disponibilidad
      .filter(dia => dia.horaInicio !== '' || dia.horaFin !== '')  
      .map(dia => ({
        diaSemana: dia.diaSemana,
        horaInicio: dia.horaInicio,
        horaFin: dia.horaFin,
      }));
      this.empleado.fulltime = this.fullTime

    this.empleadoService.createEmpleado(this.empleado).subscribe({
      next: (response) => {
        console.log('Empleado guardado con éxito:', response);
        this.mostrarAlerta('Operación Exitosa', 'Empleado guardado con éxito.', 'success');
        this.limpiarFormulario();
        this.router.navigate(['/employee']);
      },
      error: (err) => {
        console.error('Error al guardar el empleado:', err);
        this.mostrarAlerta('Error Operación', 'Error al guardar el empleado. Campos requeridos no completados.', 'error');
      }
    });
  }

  limpiarFormulario() {
    this.empleado = {
      empleadoId: 0,
      legajo: null,
      nombre: '',
      apellido: '',
      nroDocumento: null,
      telefono: null,
      email: '',
      fechaIngreso: undefined,
      eliminado: false,
      ciudad: null,
      categoria: null,
      disponibilidadID: null,
      observaciones:''
    };
  }
  
  cancelar() {
    this.router.navigate(['/employee']);
  }
}
