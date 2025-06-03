import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { CategoriaServicioService } from '../services/categoria-servicios.service'; 
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { OrdenTrabajoService } from '../../ordenTrabajo/services/orden-trabajo.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { MatIconModule } from '@angular/material/icon';
import { FacturaService } from '../../facturas/services/factura.service';
import { ServicioService } from '../services/servicio.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { OrdenGrupo, OrdenTrabajo } from '../../ordenTrabajo/models/orden-trabajo.models';

@Component({
  selector: 'app-empresas-edit',
  standalone: true,
  imports: [
    NavbarComponent, 
    FormsModule, 
    CommonModule, 
    RouterModule, 
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatTableModule,
    MatExpansionModule,
    MatCardModule,
    MatPaginatorModule
  ],
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
  facturas: any[] = [];
  facturasFiltradas: any[] = [];
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => 2024 + i);
  anioSeleccionado: number = new Date().getFullYear(); 
  mesSeleccionado: number = new Date().getMonth() + 1; 
  estadoSeleccionado: boolean = false;
  filtroEmpleado: string = '';

  ordenesAgrupadas: OrdenGrupo[] = [];
  ordenesAgrupadasPaginadas: OrdenGrupo[] = [];
  pageSize = 5;
  pageIndex = 0;

  selectedIndex: number = 0;

  constructor(
    private http: HttpClient,
    private empresaService: ServicioService,
    private categoriaEmpresaService: CategoriaServicioService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private ordenTrabajoService: OrdenTrabajoService,
    private facturaService: FacturaService   
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
      this.obtenerOrdenes(this.servicioId);
      this.obtenerFacturas(this.servicioId);
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
    this.empresaService.getServicioById(Number(id)).subscribe({
      next: (data) => {
        this.servicio = data;
        if (this.servicio.categoria && typeof this.servicio.categoria === 'object') {
          this.servicio.categoria = this.servicio.categoria.id;
        }
        console.log('Información de Servicio:', this.servicio);
        
        // Cargar el nombre de la ciudad si existe el ID
        if (this.servicio.ciudad) {
          this.obtenerNombreCiudad(this.servicio.ciudad.toString()).subscribe({
            next: (response) => {
              if (response.localidades_censales && response.localidades_censales.length > 0) {
                const ciudad = response.localidades_censales[0];
                const ciudadObj = {
                  id: this.servicio.ciudad,
                  nombre: ciudad.nombre
                };
                this.ciudadNombre = ciudad.nombre;
                this.ciudades = [ciudadObj];
                console.log('Ciudad cargada:', ciudadObj);
              }
            },
            error: (err) => {
              console.error('Error al obtener el nombre de la ciudad', err);
              this.ciudadNombre = '';
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al cargar los datos del servicio', err);
      }
    });
  }

  obtenerNombreCiudad(idCiudad: string) {
    const url = `https://apis.datos.gob.ar/georef/api/localidades-censales?id=${idCiudad}`
    return this.http.get<any>(url);
  }

  buscarCiudad(event: any) {
    const query = event.target.value;
    if (query.length > 2) {
      const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${this.provinciaCórdobaId}&nombre=${query}&max=10`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          console.log('Respuesta de la API:', response);
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
    } else {
      this.ciudades = [];
    }
  }

  displayCiudad(ciudad: any): string {
    if (!ciudad) return '';
    if (typeof ciudad === 'string') return ciudad;
    return ciudad.nombre || '';
  }

  seleccionarCiudad(event: any) {
    const selectedCity = event.option.value;
    console.log('Ciudad seleccionada:', selectedCity);
    if (selectedCity && selectedCity.id) {
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
          this.empresaService.updateServicio(Number(servicioId), this.servicio).subscribe({
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
    this.ordenTrabajoService.getOrdenesForServicio(servicioId).subscribe({
      next: (data) => {
        this.ordenes = data;
        this.ordenesFiltradas = data;
        this.ordenesAgrupadas = this.agruparOrdenes(this.ordenes);
        this.actualizarPagina();
        console.log('Órdenes obtenidas:', this.ordenesFiltradas);
      },
      error: (err) => {
        console.error('Hubo un error al obtener las órdenes de trabajo', err);
      }
    });
  }

  agruparOrdenes(ordenes: OrdenTrabajo[]): OrdenGrupo[] {
    const mapa = new Map<string, OrdenGrupo>();
  
    for (const orden of ordenes) {
      const clave = `${orden.anio}-${orden.mes}`;
      if (!mapa.has(clave)) {
        mapa.set(clave, {
          anio: orden.anio,
          mes: orden.mes,
          ordenes: []
        });
      }
      mapa.get(clave)?.ordenes.push(orden);
    }
  
    return Array.from(mapa.values()).sort((a, b) => {
      if (a.anio !== b.anio) {
        return b.anio - a.anio; 
      } else {
        return b.mes - a.mes;   
      }
    });
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
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[numeroMes - 1];
  }

  obtenerDias(necesidades: any[]): string {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'];
    const diasConHorario = necesidades
      .filter(n => n.horaInicio !== "00:00:00" && n.horaFin !== "00:00:00")
      .map(n => diasSemana[parseInt(n.diaSemana, 10) - 1]) 
      .filter((dia, index, self) => dia && self.indexOf(dia) === index);
    return diasConHorario.join(', ') || 'No hay días con horarios definidos';
  }
  
  obtenerFacturas(servicioId: string) {
    this.facturaService.findByServicio(Number(servicioId)).subscribe({
      next: (data) => {
        this.facturas = data;
        this.facturasFiltradas = data;
        console.log('Órdenes obtenidas:', this.facturasFiltradas);
      },
      error: (err) => {
        console.error('Hubo un error al obtener las facturas de trabajo', err);
      }
    });
  }

  cancelar() {
    alert('Servicio NO actualizado, operación cancelada.');
    this.router.navigate(['/service']);
  }
  truncateToTwoDecimals(value: number): string {
    return Math.floor(value * 100) / 100 + ''; 
  }
}
