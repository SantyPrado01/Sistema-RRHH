import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { EmpleadoService } from '../services/empleado.service';
import { CategoriaEmpleadoService } from '../services/categoria-empleado.service';
import { OrdenTrabajoService } from '../../ordenTrabajo/services/orden-trabajo.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { Empleado } from '../models/empleado.models';
import { CategoriaEmpleado } from '../models/categoria.models';
import { Disponibilidad } from '../models/disponibilidad.models';
import { HorariosAsignadosService } from '../../horariosAsignados/services/horariosAsignados.service';
import { FormControl } from '@angular/forms';

interface Ciudad {
  id: number;
  nombre: string;
}

interface HorarioAsignado {
  fecha: string;
  horaInicioReal: string;
  horaFinReal: string;
  empleado?: {
    Id: number;
    [key: string]: any;
  };
  empleadoSuplente?: {
    Id: number;
    [key: string]: any;
  };
}

@Component({
  selector: 'app-empleados-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatExpansionModule,
    MatCardModule,
    MatPaginatorModule,
    AlertDialogComponent
  ],
  templateUrl: './empleados-edit.component.html',
  styleUrls: ['./empleados-edit.component.css'],
  providers: [DatePipe]
})
export class EmpleadosEditComponent implements OnInit {
  selectedIndex: number = 0;
  empleado: Empleado = new Empleado(
    0, 0, '', '', 0, 0, '', false, 0, '', 0
  );
  empleadoId: string | null = null;
  categorias: CategoriaEmpleado[] = [];
  ciudades: Ciudad[] = [];
  ciudadNombre: any = '';
  provinciaCórdobaId = 14;
  fullTime: boolean = false;
  disponibilidad: Disponibilidad[] = [];
  ordenesAgrupadas: any[] = [];
  ordenesAgrupadasPaginadas: any[] = [];
  horariosAgrupados: any[] = [];
  pageSize = 5;
  pageIndex = 0;
  ciudadControl = new FormControl('');
  horasCategoria: number = 0;

  constructor(
    private empleadoService: EmpleadoService,
    private categoriaEmpleadoService: CategoriaEmpleadoService,
    private ordenTrabajoService: OrdenTrabajoService,
    private horariosAsignadosService: HorariosAsignadosService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.inicializarDisponibilidad();
  }

  ngOnInit() {
    this.empleadoId = this.route.snapshot.paramMap.get('id');
    if (this.empleadoId) {
      this.cargarEmpleado();
      this.obtenerOrdenes();
      this.obtenerHorarios();
    }
    this.cargarCategorias();
  }

  inicializarDisponibilidad() {
    const diasSemana = [
      { diaSemana: 1 },
      { diaSemana: 2 },
      { diaSemana: 3 },
      { diaSemana: 4 },
      { diaSemana: 5 },
      { diaSemana: 6 },
      { diaSemana: 7 }
    ];

    this.disponibilidad = diasSemana.map(dia => ({
      disponibilidadHorariaId: 0,
      empleadoId: 0,
      diaSemana: dia.diaSemana,
      horaInicio: '00:00',
      horaFin: '00:00'
    }));
  }

  getNombreDia(diaSemana: number): string {
    if (!diaSemana || diaSemana < 1 || diaSemana > 7) return '';
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    return dias[diaSemana - 1];
  }

  cargarEmpleado() {
    if (this.empleadoId) {
      console.log('Cargando empleado con ID:', this.empleadoId);
      this.empleadoService.getEmpleadoById(Number(this.empleadoId)).subscribe({
        next: (data) => {
          console.log('Datos del empleado recibidos:', data);
          this.empleado = data;
          // Ajustar la fecha para compensar la zona horaria
          if (this.empleado.fechaIngreso) {
            const fecha = new Date(this.empleado.fechaIngreso);
            fecha.setHours(fecha.getHours() + 3); // Ajustar a zona horaria de Argentina
            this.empleado.fechaIngreso = fecha;
          }

          if (this.empleado.ciudad) {
            this.obtenerNombreCiudad(this.empleado.ciudad.toString());
          } else {
            console.log('No se encontró ID de ciudad');
          }
          if (this.empleado.disponibilidades) {
            this.disponibilidad = this.empleado.disponibilidades;
            this.fullTime = this.empleado.fulltime ?? false;
          }
        },
        error: (err) => {
          console.error('Error al cargar el empleado', err);
          this.mostrarAlerta('Error', 'No se pudo cargar la información del empleado', 'error');
        }
      });
    }
  }

  cargarCategorias() {
    this.categoriaEmpleadoService.getCategoriasEmpleados().subscribe({
      next: (data: CategoriaEmpleado[]) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al cargar las categorías', err);
        this.mostrarAlerta('Error', 'No se pudieron cargar las categorías', 'error');
      }
    });
  }

  displayCiudad(ciudad: any): string {
    console.log('Display ciudad llamado con:', ciudad);
    if (!ciudad) return '';
    if (typeof ciudad === 'string') return ciudad;
    return ciudad.nombre || '';
  }

  buscarCiudad(event: any) {
    const query = event.target.value;
    if (query.length > 2) {
      const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${this.provinciaCórdobaId}&nombre=${query}&max=10`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.ciudades = response.localidades.map((localidad: any) => ({
            id: localidad.id,
            nombre: localidad.nombre
          }));
        },
        error: (err) => {
          console.error('Error al obtener las ciudades', err);
          this.ciudades = [];
        }
      });
    }
  }

  seleccionarCiudad(event: any) {
    const selectedCity = event.option.value;
    
    if (selectedCity && selectedCity.id) {
      this.empleado.ciudad = selectedCity.id;
      this.ciudadNombre = selectedCity;
    }
  }

  obtenerNombreCiudad(idCiudad: string) {
    console.log('Obteniendo nombre de ciudad para ID:', idCiudad);
    const url = `https://apis.datos.gob.ar/georef/api/localidades?id=${idCiudad}`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('Respuesta de la API de ciudades:', response);
        if (response.localidades && response.localidades.length > 0) {
          const ciudad = response.localidades[0];
          console.log('Datos de la ciudad encontrada:', ciudad);
          const ciudadObj = {
            id: ciudad.id,
            nombre: ciudad.nombre
          };
          this.ciudades = [ciudadObj];
          this.ciudadNombre = ciudadObj;
          console.log('Ciudad cargada en el componente:', {
            ciudades: this.ciudades,
            ciudadNombre: this.ciudadNombre
          });
        } else {
          console.log('No se encontraron datos de la ciudad');
        }
      },
      error: (err) => {
        console.error('Error al obtener el nombre de la ciudad', err);
      }
    });
  }

  toggleFullTime() {
    if (this.fullTime) {
      this.disponibilidad = this.disponibilidad.map(dia => ({
        ...dia,
        horaInicio: '09:00',
        horaFin: '18:00'
      }));
    } else {
      this.disponibilidad = this.disponibilidad.map(dia => ({
        ...dia,
        horaInicio: '00:00',
        horaFin: '00:00'
      }));
    }
  }

  checkFullTime() {
    const isFullTime = this.disponibilidad.every(dia =>
      dia.horaInicio === '09:00' && dia.horaFin === '18:00'
    );
    this.fullTime = isFullTime;
  }

  validarSoloLetras(event: any) {
    const pattern = /[a-zA-Z\s]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  validarTelefono(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  actualizarEmpleado() {
    if (this.empleadoId) {
      this.empleado.disponibilidades = this.disponibilidad;
      this.empleado.fulltime = this.fullTime;
      this.empleado.legajo = Number(this.empleado.legajo);
      
      if (this.empleado.ciudad) {
        this.empleado.ciudad = Number(this.empleado.ciudad);
      }
      const fechaFormateada = this.datePipe.transform(this.empleado.fechaIngreso, 'yyyy/MM/dd');
    
      this.empleado.fechaIngreso = fechaFormateada!;
      console.log('Datos a enviar:', this.empleado);

      this.empleadoService.updateEmpleado(Number(this.empleadoId), this.empleado).subscribe({
        next: (response) => {
          this.mostrarAlerta('Éxito', 'Empleado actualizado correctamente', 'success');
          this.router.navigate(['/empleados']);
        },
        error: (err) => {
          this.mostrarAlerta('Error', 'No se pudo actualizar el empleado', 'error');
        }
      });
    }
  }

  obtenerOrdenes() {
    if (this.empleadoId) {
      this.ordenTrabajoService.getOrdenesForEmpleado(this.empleadoId).subscribe({
        next: (data) => {  
          this.ordenesAgrupadas = this.agruparOrdenes(data);
          this.actualizarPagina();
        },
        error: (err) => {
          console.error('Error al obtener las órdenes', err);
        }
      });
    }
  }

  agruparOrdenes(ordenes: any[]): any[] {
    if (!Array.isArray(ordenes)) {
      console.error('ordenes no es un array:', ordenes);
      return [];
    }

    const mapa = new Map<string, any>();
    
    for (const orden of ordenes) {
      console.log('Procesando orden:', orden);
      if (!orden.mes || !orden.anio) {
        console.warn('Orden sin mes o año:', orden);
        continue;
      }

      const mes = orden.mes;
      const anio = orden.anio;
      console.log(`Mes: ${mes}, Año: ${anio}`);
      const clave = `${anio}-${mes}`;
      
      if (!mapa.has(clave)) {
        mapa.set(clave, {
          anio: anio,
          mes: mes,
          ordenes: []
        });
      }
      
      mapa.get(clave).ordenes.push(orden);
    }
    
    const resultado = Array.from(mapa.values()).sort((a, b) => {
      if (a.anio !== b.anio) return b.anio - a.anio;
      return b.mes - a.mes;
    });

    return resultado;
  }

  actualizarPagina() {
    const inicio = this.pageIndex * this.pageSize;
    const fin = inicio + this.pageSize;
    this.ordenesAgrupadasPaginadas = this.ordenesAgrupadas.slice(inicio, fin);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.actualizarPagina();
  }

  getNombreMes(numeroMes: number): string {
    if (!numeroMes || isNaN(numeroMes) || numeroMes < 1 || numeroMes > 12) {
      console.warn('Mes inválido:', numeroMes);
      return '';
    }
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[numeroMes - 1];
  }

  getHorasTotales(horarios: HorarioAsignado[]): number {
  if (!Array.isArray(horarios)) return 0;

  const empleadoId = Number(this.empleadoId);
  const totalMinutos = horarios.reduce((total, horario) => {
    if (!horario.horaInicioReal || !horario.horaFinReal) return total;

    const esTitular = horario.empleado?.Id === empleadoId;
    const esSuplente = horario.empleadoSuplente?.Id === empleadoId;

    // 👉 Solo cuenta si es suplente, o si es titular y no hubo suplente
    if (esSuplente || (esTitular && !horario.empleadoSuplente)) {
    
      return total + (this.calcularHorasDecimal(horario.horaInicioReal, horario.horaFinReal));
    }

    return total;
  }, 0);
  return totalMinutos;
}
  

  calcularHorasDecimal(horaInicio: string, horaFin: string): number {
  const [hInicio, mInicio] = horaInicio.split(':').map(Number);
  const [hFin, mFin] = horaFin.split(':').map(Number);

  const inicioEnMinutos = hInicio * 60 + mInicio;
  const finEnMinutos = hFin * 60 + mFin;

  let diferenciaMinutos: number;

  if (finEnMinutos >= inicioEnMinutos) {
    // Caso normal, mismo día
    diferenciaMinutos = finEnMinutos - inicioEnMinutos;
  } else {
    // Caso nocturno, cruza medianoche
    diferenciaMinutos = (24 * 60 - inicioEnMinutos) + finEnMinutos;
  }

  const horasDecimales = diferenciaMinutos / 60;
  return parseFloat(horasDecimales.toFixed(2));
  }

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo }
    });
  }

  cancelar() {
    this.router.navigate(['/empleados']);
  }

  compareCategorias(categoria1: CategoriaEmpleado, categoria2: CategoriaEmpleado): boolean {
    if (!categoria1 || !categoria2) return false;
    return categoria1.id === categoria2.id;
  }

  obtenerHorarios() {
    if (this.empleadoId) {
      this.horariosAsignadosService.buscarHorariosPorEmpleado(Number(this.empleadoId)).subscribe({
        next: (res: any) => {
          const horarios: HorarioAsignado[] = res.horarios;
          console.log('📦 Horarios recibidos del backend:', horarios);
          
          const agrupadosPorAnio: Record<number, Record<number, HorarioAsignado[]>> = horarios.reduce(
            (acc: Record<number, Record<number, HorarioAsignado[]>>, horario: HorarioAsignado) => {
              const fecha = new Date(horario.fecha);
              const anio = fecha.getFullYear();
              const mes = fecha.getMonth() + 1;
              
              if (!acc[anio]) acc[anio] = {};
              if (!acc[anio][mes]) acc[anio][mes] = [];
              
              acc[anio][mes].push(horario);
              return acc;
            },
            {}
          );
          
          this.horariosAgrupados = Object.entries(agrupadosPorAnio)
            .map(([anio, meses]) => ({
              anio: +anio,
              meses: Object.entries(meses)
                .map(([mes, horarios]) => ({
                  mes: +mes,
                  horarios,
                }))
                .sort((a, b) => b.mes - a.mes),
            }))
            .sort((a, b) => b.anio - a.anio);
        },
        error: (err) => {
          console.error('Error al obtener los horarios', err);
          this.mostrarAlerta('Error', 'No se pudieron cargar los horarios', 'error');
        }
      });
    }
  }
}
