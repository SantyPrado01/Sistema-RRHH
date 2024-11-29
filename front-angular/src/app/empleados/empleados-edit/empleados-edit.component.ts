import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoriaEmpleadoService } from '../services/categoria-empleado.service'; 
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { OrdenTrabajoService } from '../../ordenTrabajo/services/orden-trabajo.service';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-empleado',
  standalone: true,
  templateUrl: './empleados-edit.component.html',
  imports:[NavbarComponent, FormsModule, CommonModule, RouterModule, MatIconModule],
  styleUrls: ['./empleados-edit.component.css']
})
export class EditEmpleadoComponent implements OnInit {

  ordenes: any[] = [];
  ordenesFiltradas: any[] = [];
  seccionActual: string = 'datosPersonales';
  empleado: any = {};
  categorias: any[] = [];
  ciudades: any[] = [];
  categoriaEmpleado: string = '';
  provinciaCórdobaId = 14;
  ciudadNombre: string = '';
  contadorCaracteres: number = 0;
  empleadoId: string | null = null;
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => 2024 + i);
  anioSeleccionado: number = new Date().getFullYear(); 
  mesSeleccionado: number = new Date().getMonth() + 1; 
  estadoSeleccionado: boolean = false;

  filtroEmpresa: string = '';

  disponibilidad = [
    { disponibilidadHorariaId:null, diaSemana: 1, nombre: 'Lunes', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 2, nombre: 'Martes', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 3, nombre: 'Miércoles', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 4, nombre: 'Jueves', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 5, nombre: 'Viernes', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 6, nombre: 'Sábado', horaInicio: '', horaFin: '' },
    { disponibilidadHorariaId:null, diaSemana: 7, nombre: 'Domingo', horaInicio: '', horaFin: '' }
  ];

  fullTime: boolean = false;

  constructor(
    private http: HttpClient, 
    private categoriaEmpleadoService: CategoriaEmpleadoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private ordenTrabajoService: OrdenTrabajoService  
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
    this.empleadoId = this.route.snapshot.paramMap.get('id');
    if (this.empleadoId){
      this.cargarEmpleado(this.empleadoId)
      this.obtenerOrdenes(this.empleadoId)
    };
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

  getCategoriaNombre(id: number): string {
    const categoria = this.categorias.find(c => c.categoria === id);
    console.log('Esto es en el GET:',categoria)
    return categoria ? categoria.nombreCategoriaEmpleado : 'Desconocido';
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
        console.log(this.empleado)
        this.fullTime = this.empleado.fulltime || false;
        console.log('Fulltime', this.empleado.fullTime)
        this.disponibilidad.forEach(dia => {
          const disp = this.empleado.disponibilidades?.find((d: any) => d.diaSemana === dia.diaSemana);
          if (disp) {
            dia.disponibilidadHorariaId = disp.disponibilidadHorariaId;
            dia.horaInicio = this.formatearHora(disp.horaInicio);
            dia.horaFin = this.formatearHora(disp.horaFin);
          } else {
            dia.horaInicio = '';
            dia.horaFin = '';
          }
        });
        if (this.empleado.ciudad) {
          this.obtenerNombreCiudad(this.empleado.ciudad.toString()).subscribe({
            next: (response) => {
              this.ciudadNombre = response.localidades_censales?.[0]?.nombre ?? 'Desconocido';
            },
            error: (err) => {
              console.error('Error al obtener el nombre de la ciudad', err);
              this.ciudadNombre = 'Error';
            }
          });
        } else {
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

  seleccionarCiudad(event: any) {
    const selectedCity = this.ciudades.find(c => c.nombre === event.target.value);
    if (selectedCity) {
      this.empleado.ciudad = selectedCity.id;
      this.ciudadNombre = selectedCity.nombre;
    }
  }

  actualizarEmpleado() {
    const empleadoId = this.route.snapshot.paramMap.get('id');
    if (empleadoId) {
      const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
        data: {
          title: 'Confirmar actualización',
          message: '¿Está seguro de que desea actualizar este empleado?',
          type: 'confirm', 
        },
      });

      dialogRef.afterClosed().subscribe((confirmado) => {
        if (confirmado) {
          const empleadoActualizado = {
            ...this.empleado,
            disponibilidades: this.disponibilidad, 
            fulltime: this.fullTime,
          };

          this.http.patch<any>(`http://localhost:3000/empleados/${empleadoId}`, empleadoActualizado).subscribe({
            next: (response) => {
              this.mostrarAlerta('Operación Exitosa', 'Empleado actualizado con éxito.', 'success');
              this.router.navigate(['/employee']);
            },
            error: (err) => {
              console.error('Error al actualizar el empleado:', err);
              this.mostrarAlerta('Error Operación', 'Error al guardar el empleado.', 'error');
            }
          });
        } else {
          this.mostrarAlerta('Operación Cancelada', 'Operacion Cancelada.', 'error');
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

  formatearHora(hora: string): string {
    if (!hora) return '';
    const [horaParte, minutosParte] = hora.split(':');
    return `${horaParte}:${minutosParte}`;
  }

  obtenerOrdenes(empleadoId: string) {
    this.ordenTrabajoService.getOrdenesForEmpleado(this.mesSeleccionado, this.anioSeleccionado, empleadoId).subscribe({
      next: (data) => {
        this.ordenes = data;
        this.ordenesFiltradas = data
        console.log('Órdenes obtenidas:', this.ordenesFiltradas);
      },
      error: (err) => {
        console.error('Hubo un error al obtener las órdenes de trabajo', err);
        this.mostrarAlerta('Error', 'No se pudieron obtener las órdenes de trabajo.', 'error');
      }
    });
  }

  mesesMap: { [key: string]: number } = {
    'Enero': 1,
    'Febrero': 2,
    'Marzo': 3,
    'Abril': 4,
    'Mayo': 5,
    'Junio': 6,
    'Julio': 7,
    'Agosto': 8,
    'Septiembre': 9,
    'Octubre': 10,
    'Noviembre': 11,
    'Diciembre': 12
  };

  filtrarOrdenes() {
    const anioSeleccionado = Number(this.anioSeleccionado);
    const mesSeleccionadoNum = this.mesesMap[this.mesSeleccionado];
    
    this.ordenesFiltradas = this.ordenes.filter(orden => {

      const coincideEmpresa = this.filtroEmpresa
        ? orden.servicio.nombre && orden.servicio.nombre.toLowerCase().includes(this.filtroEmpresa.toLowerCase())
        : true;

      const coincideMes = mesSeleccionadoNum
      ? orden.mes === mesSeleccionadoNum
      : true;

      const coincideAnio = this.anioSeleccionado
      ? orden.anio === anioSeleccionado
      : true;

      const coincideEstado = this.estadoSeleccionado !== undefined
        ? (this.estadoSeleccionado === true ? orden.completado === true : orden.completado === false)
        : true;
      return coincideEmpresa && coincideMes && coincideAnio && coincideEstado;
    });
  
    console.log('Órdenes filtradas:', this.ordenesFiltradas);
  }

  obtenerDias(necesidades: any[]): string {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'];
    const diasConHorario = necesidades
      .filter(n => n.horaInicio !== "00:00:00" && n.horaFin !== "00:00:00")
      .map(n => diasSemana[parseInt(n.diaSemana, 10) - 1]) 
      .filter((dia, index, self) => dia && self.indexOf(dia) === index);
    return diasConHorario.join(', ') || 'No hay días con horarios definidos';
  }

  cancelar() {
    alert('Empleado NO actualizado, operación cancelada.');
    this.mostrarAlerta('Operacion Cancelada', 'Empleado NO actualizado.', 'success');
    this.router.navigate(['/employee']);
  }
}
