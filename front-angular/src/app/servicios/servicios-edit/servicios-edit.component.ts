import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CategoriaServicioService } from '../services/categoria-servicios.service'; 
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OrdenTrabajoService } from '../../ordenTrabajo/services/orden-trabajo.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empresas-edit',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, RouterModule, MatIconModule],
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

  ordenes: any[] = [];
  ordenesFiltradas: any[] = [];
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => 2024 + i);
  anioSeleccionado: number = new Date().getFullYear(); 
  mesSeleccionado: number = new Date().getMonth() + 1; 
  estadoSeleccionado: boolean = false;
  filtroEmpleado: string = '';

  constructor(
    private http: HttpClient,
    private categoriaEmpresaService: CategoriaServicioService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ordenTrabajoService: OrdenTrabajoService   
  ) {}

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }

  ngOnInit() {
    this.servicioId = this.route.snapshot.paramMap.get('id');
    if (this.servicioId) {
      this.cargarServicio(this.servicioId);
      this.obtenerOrdenes(this.servicioId)
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
        console.log('Informacion de Servicio:', this.servicio)
        if (this.servicio.ciudad){
          this.obtenerNombreCiudad(this.servicio.ciudad.toString()).subscribe({
            next: (response) => {
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
    console.log('Esto es en el GET:',categoria)
    return categoria ? categoria.nombreCategoriaServico : 'Desconocido';
  }

  actualizarEmpresa() {
    const servicioId = this.route.snapshot.paramMap.get('id');
    if (servicioId) {
      const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
        data: {
          title: 'Confirmar actualización',
          message: '¿Está seguro de que desea actualizar esta empresa?',
          type: 'confirm',
        },
      });

      dialogRef.afterClosed().subscribe((confirmado)=>{
        if(confirmado){
          this.http.patch<any>(`http://localhost:3000/servicios/${this.servicioId}`, this.servicio).subscribe({
            next: (response) => {
              this.mostrarAlerta('Operación Exitosa', 'Empresa actualizada con éxito.', 'success');
              this.router.navigate(['/service']);
            },
            error: (err) => {
              this.mostrarAlerta('Error Operación', 'Error al actualizar la empresa.', 'error');
            }
          });
        }else{
          this.mostrarAlerta('Operación Cancelada', 'Operacion Cancelada.', 'error');
        }
      })
    }
  }

  obtenerOrdenes(servicioId: string) {
    this.ordenTrabajoService.getOrdenesForServicio(this.mesSeleccionado, this.anioSeleccionado, servicioId).subscribe({
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

      const coincideEmpleado = this.filtroEmpleado
        ? orden.empleado.nombre && orden.empleado.nombre.toLowerCase().includes(this.filtroEmpleado.toLowerCase())
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
      return coincideEmpleado && coincideMes && coincideAnio && coincideEstado;
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
    alert('Servicio NO actualizado, operación cancelada.');
    this.router.navigate(['/service']);
  }
}
