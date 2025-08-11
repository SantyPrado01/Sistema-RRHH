import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../nabvar/navbar.component';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OrdenTrabajoService } from '../ordenTrabajo/services/orden-trabajo.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { HorariosAsignadosService } from '../horariosAsignados/services/horariosAsignados.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { debounceTime, switchMap, filter } from 'rxjs/operators';
import { EmpleadoService } from '../empleados/services/empleado.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ServicioService } from '../servicios/services/servicio.service';
import {MatSelect, MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Empleado } from '../empleados/models/empleado.models';
import { Empresa } from '../servicios/models/servicio.models';
import { getSpanishPaginatorIntl } from '../spanish-paginator-intl';
import { HttpErrorResponse } from '@angular/common/http';

interface Totales {
  horasProyectadas: number;
  horasTrabajadas: number;
  horasAusentismoPago: number;
  horasAusentismoNoPago: number;
}

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [
    NavbarComponent, 
    CommonModule, 
    RouterModule, 
    FormsModule, 
    MatIconModule, 
    MatDatepickerModule, 
    MatNativeDateModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatAutocompleteModule, 
    MatOptionModule, 
    ReactiveFormsModule, 
    MatOptionModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatTableModule, 
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
  ],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.css'
})

export class InformesComponent  {

  ordenes: any[] = [];
  dataSource = new MatTableDataSource<any>([]);

  fechaInicio: string = '';
  fechaFin: string = '';
  empleadoId?: number;
  servicioId?: number;
  loading: boolean = false;
  anio: number = new Date().getFullYear();
  completado: boolean = false;
  horasProyectadas: number = 0;
  horasReales: number = 0;
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => 2024 + i);
  anioSeleccionado: number = new Date().getFullYear(); 
  mesSeleccionado: string = this.meses[new Date().getMonth()]; 
  estadoSeleccionado: boolean = false;
  reporteSeleccionado: string = '';
  necesidad: any[]= [];
  empleadoControl = new FormControl('');
  empleadosFiltrados: any[] = [];
  empresaControl = new FormControl('');
  empresasFiltradas: any[] = [];

  totalHorasRealesGlobal: number = 0;
  totalHorasProyectadasGlobal: number = 0;

  horasTotalesProyectadasEmpresa: number = 0;
  horasTotalesRealesEmpresa: number = 0;

  totales: Totales = {
    horasProyectadas: 0,
    horasTrabajadas: 0,
    horasAusentismoPago: 0,
    horasAusentismoNoPago: 0
  };


  reportes:{ nombre: string, funcion: ()=> void }[] = [
    {nombre:'Reporte de horas por Empleado por Empresa', funcion: this.obtenerOrdenesMesAnio.bind(this)},
    {nombre:'Reporte de horas por Dia', funcion: this.buscarHorarios.bind(this)},
    {nombre:'Reporte Resumen por Empresa', funcion: this.obtenerResumenPorEmpresa.bind(this)},
  ];

  headerMap: { [key: string]: string } = {
    'empresa': 'Empresa', // Común
    'empleado': 'Empleado', // Común
    'empleadoSuplente': 'Empleado Suplente',
    'estadoSuplente': 'Estado Suplente',
    'fecha': 'Fecha', // Solo en BuscarHorarios
    'horasInicioProyectado': 'Ingreso Proy.', // Solo en BuscarHorarios
    'horasFinProyectado': 'Salida Proy.',       // Solo en BuscarHorarios
    'horaInicioReal': 'Ingreso Real',             // Solo en BuscarHorarios
    'horaFinReal': 'Salida Real',                   // Solo en BuscarHorarias
    'estado': 'Estado', 
    'horasReales': 'Horas Reales', 
    'dias': 'Dias', // Solo en ObtenerOrdenesMesAnio
    'horasProyectadas': 'Horas Proyectadas',
    'horasTotales': 'Total', // Solo en ObtenerOrdenesMesAnio
  };

  displayedColumnsBuscarHorarios: string[] = [
    'empresa',
    'empleado',
    'estado',
    'empleadoSuplente',
    'estadoSuplente',
    'fecha',
    'horasInicioProyectado',
    'horasFinProyectado',
    'horaInicioReal',
    'horaFinReal',
    'horasTotales',
  ];

  displayedColumnsObtenerOrdenes: string[] = [
    'empresa',
    'horarioAsignado',
    'dias',
    'horasAutorizadas',
    'horasProyectadas',
    'horasTrabajadas',
    'horasAusentismoPago',
    'horasAusentismoNoPago',
  ]

  displayedColumnsObtenerResumenPorEmpresa: string[] = [
    'empresa',
    'horasFijas',
    'horasProyectadas',
    'horasReales'
  ]

  private matPaginator!: MatPaginator;
  @ViewChild(MatPaginator) set matPaginatorSetter(mp: MatPaginator) {
    this.matPaginator = mp;
    if (this.dataSource){
      this.dataSource.paginator = this.matPaginator;
      this.matPaginator.firstPage();
    }
  }

  private matSort: MatSort | null = null;
  @ViewChild(MatSort) set matSortSetter(ms: MatSort | null) {
    this.matSort = ms;
    if (this.dataSource) {
      this.dataSource.sort = this.matSort;
    }
  }

  @ViewChild(MatSelect) reporteMatSelect!: MatSelect;

  constructor(
    private datePipe: DatePipe,
    private ordenTrabajoService: OrdenTrabajoService,
    private horariosAsignadosService: HorariosAsignadosService,
    private empleadoService: EmpleadoService,
    private empresasService: ServicioService, 
    ) {}

    ngOnInit(): void {
      this.empleadoControl.valueChanges
        .pipe(
          debounceTime(300),
          filter(value => typeof value === 'string'), 
          switchMap(value => this.empleadoService.buscarEmpleados(value))
        )
        .subscribe(result => {
          this.empleadosFiltrados = result;
        });

      this.empresaControl.valueChanges
        .pipe(
          debounceTime(300),
          filter(value => typeof value === 'string'), 
          switchMap(value => this.empresasService.buscarEmpresas(value))
        )
        .subscribe(result => {
          this.empresasFiltradas = result;
          console.log('Empresas filtradas:', this.empresasFiltradas);
        });
        this.dataSource.sortingDataAccessor = (item: any, headerId: string) => {
          
          if (item && item.ordenTrabajo && item.empleado){
            switch (headerId) {
            case 'empresa': return item.ordenTrabajo.servicio.nombre;
            case 'empleado': return `${item.empleado.nombre} ${item.empleado.apellido}`;
            case 'fecha': {
              // Manejar ordenamiento de fecha de forma robusta
              const fecha = item.fecha;
              if (!fecha) return -1; // O algún valor que indique que no hay fecha
              if (fecha instanceof Date) return fecha.getTime();
              if (typeof fecha === 'string') {
                  const date = new Date(fecha);
                  // Devuelve el timestamp si es una fecha válida, -1 si no lo es
                  return isNaN(date.getTime()) ? -1 : date.getTime();
              }
              return -1; // Maneja otros tipos
            }
            case 'horasInicioProyectado': return item.horaInicioProyectado;
            case 'horasFinProyectado': return item.horaFinProyectado;
            case 'horaInicioReal': return item.horaInicioReal;
            case 'horaFinReal': return item.horaFinReal;
            case 'horasTotales': return item.duracionReal;
            case 'estado': return item.estado;

            default: return (item as any)[headerId]; 
          }
          }
          else if(item && item.servicio && item.empleadoAsignado){
            switch (headerId) {
              case 'empresa': return item.servicio?.nombre;
              case 'empleado': return `${item.empleado.nombre} ${item.empleado.apellido}`;
              default: return (item as any)[headerId]; 
            }

          }
          
        };
    }

    onReporteSeleccionado():void{
      this.dataSource.data = [];
      this.reporteMatSelect.close()
    }

    seleccionarEmpleado(empleado: any): void {
      console.log('Empleado seleccionado:', empleado.Id);
      
      this.empleadoId = empleado.Id;  
    }

    displayEmployeeName(empleado: Empleado): string {
      return empleado ? empleado.nombre: '';
    }

    seleccionarEmpresa(empresa: any): void {
      console.log('Empresa seleccionada:', empresa);
    
      this.servicioId = empresa.servicioId;  
    }

    displayEmpresaName(empresa: Empresa): string {
      return empresa ? empresa.nombre: '';
    }

    obtenerResumenPorEmpresa(): void {
      this.dataSource.data = [];
      this.dataSource.sort = this.matSort;
      this.loading = true;
      let fechaFormateadaInicio: string | null = null;
      let fechaFormateadaFin: string | null = null;

      if (this.fechaInicio && this.fechaFin) {
        fechaFormateadaInicio = this.datePipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        fechaFormateadaFin = this.datePipe.transform(this.fechaFin, 'yyyy-MM-dd');
      }
  
      this.horariosAsignadosService.obtenerResumenPorEmpresa(fechaFormateadaInicio || '', fechaFormateadaFin || '', this.servicioId).subscribe(
        (data) => {

          console.log('Datos recibidos Resumen:', data);
          this.dataSource.data = data.resumenPorEmpresa;
          
          this.totalHorasProyectadasGlobal = data.totalHorasProyectadas;
          this.totalHorasRealesGlobal = data.totalHorasReales;

          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          console.error('Hubo un error al obtener los horarios asignados', error);
          this.loading = false;
        }
      );
    }

    buscarHorarios(): void {
      this.dataSource.data = [];
      this.dataSource.sort = this.matSort;
      this.loading = true;
      let fechaFormateadaInicio: string | null = null;
      let fechaFormateadaFin: string | null = null;

      if (this.fechaInicio && this.fechaFin) {
        fechaFormateadaInicio = this.datePipe.transform(this.fechaInicio, 'yyyy-MM-dd');
        fechaFormateadaFin = this.datePipe.transform(this.fechaFin, 'yyyy-MM-dd');
      }
  
      this.horariosAsignadosService.buscarHorarios(fechaFormateadaInicio || '', fechaFormateadaFin || '', this.empleadoId, this.servicioId).subscribe(
        (data: any[]) => {
          console.log('Datos recibidos (antes de procesar):', data); 
  
          const dataConDuracion = data.map(item => {
            // Función auxiliar para convertir "HH:mm" a minutos desde la medianoche
            const timeStringToMinutes = (timeString: string | null | undefined): number => {
              if (!timeString) {
                return 0; // Si la hora no está definida, retorna 0 minutos
              }
              const parts = timeString.split(':');
              if (parts.length !== 2) {
                   console.warn('Formato de hora inválido:', timeString);
                   return 0; // Formato incorrecto
              }
              const hours = parseInt(parts[0], 10);
              const minutes = parseInt(parts[1], 10);
  
              if (isNaN(hours) || isNaN(minutes)) {
                   console.warn('Números en formato de hora inválidos:', timeString);
                   return 0; // Partes no numéricas
              }
              return (hours * 60) + minutes;
            };
            
            //Calcular duracion real por cada fila
            const dataConDuraciones = data.map(item => {
              const inicioMinutes = timeStringToMinutes(item.horaInicioReal);
              const finMinutes = timeStringToMinutes(item.horaFinReal);

              let durationRealMinutes = 0;

              if (inicioMinutes >= 0 && finMinutes >= 0 && item.horaInicioReal && item.horaFinReal) {
                durationRealMinutes = finMinutes - inicioMinutes;
 
                if (durationRealMinutes < 0) {
                   // Suma 24 horas en minutos para manejar el cruce de medianoche
                   durationRealMinutes += (24 * 60);
                }
 
                if (durationRealMinutes < 0) {
                    console.warn(`Duración negativa calculada para el item (sin manejo de medianoche si aplica):`, item, `Minutos: ${durationRealMinutes}`);
                }
   
             } else {
                 console.warn(`No se pudo calcular la duración para el item debido a horas no válidas:`, item);
             }
 
             const durationRealHours = durationRealMinutes / 60;

             //Calcular horas proyectadas por cada fila
             const inicioProyectadoMinutes = timeStringToMinutes(item.horaInicioProyectado);
             const finProyectadoMinutes = timeStringToMinutes(item.horaFinProyectado);
             let durationProyectadaMinutes = 0;
             if (inicioProyectadoMinutes >= 0 && finProyectadoMinutes >= 0 && item.horaInicioProyectado && item.horaFinProyectado) {
              durationProyectadaMinutes = finProyectadoMinutes - inicioProyectadoMinutes;
 
              if (durationProyectadaMinutes < 0) {
                   // Suma 24 horas en minutos para manejar el cruce de medianoche
                   durationProyectadaMinutes += (24 * 60);
                }
 
              if (durationProyectadaMinutes < 0) {
                  console.warn(`Duración negativa calculada para el item (sin manejo de medianoche si aplica):`, item, `Minutos: ${durationProyectadaMinutes}`);
              }
             }
             const durationProyectadaHours = durationProyectadaMinutes / 60


            return{
              ...item,
              duracionReal: durationRealHours,
              horasProyectadas: durationProyectadaHours,
            };
          });

          const totalRealesSum = dataConDuraciones.reduce((sum, item) => {
            return sum +(typeof item.duracionReal === 'number' ? item.duracionReal : 0);
          }, 0);
          this.totalHorasRealesGlobal = totalRealesSum;
          const totalProyectadasSum = dataConDuraciones.reduce((sum, item) => {
            return sum +(typeof item.horasProyectadas === 'number' ? item.horasProyectadas : 0);
          }, 0);
          this.totalHorasProyectadasGlobal = totalProyectadasSum;
          this.dataSource.data = dataConDuraciones;
          console.log('Datos recibidos (después de procesar):', this.dataSource.data);
          this.loading = false;
        },
        (error: HttpErrorResponse) => {
          console.error('Hubo un error al obtener los horarios asignados', error);
          this.loading = false;
        }
        );
        }
      )
    }
          
    obtenerOrdenesMesAnio() {
    this.dataSource.data = [];
    this.dataSource.sort = this.matSort;
    const mesNumero = this.convertirMesANumero(this.mesSeleccionado);
    this.horariosAsignadosService.obtenerResumenPorServicio(mesNumero, this.anioSeleccionado).subscribe(
      (data: any) => {
        console.log('Datos:', mesNumero, this.anioSeleccionado);
        this.dataSource.data = data.servicios;
        this.totales = data.totales;
        console.log('Datos recibidos:', data);
      }
    );
    }

    convertirMesANumero(mes: string): number {
      const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      return meses.indexOf(mes) + 1;
    }

    obtenerDias(necesidades: any[]): string {
      const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'];
      const diasConHorario = necesidades
        .filter(n => n.horaInicio !== "00:00:00" && n.horaFin !== "00:00:00")
        .map(n => diasSemana[parseInt(n.diaSemana, 10) - 1]) 
        .filter((dia, index, self) => dia && self.indexOf(dia) === index);
      return diasConHorario.join(', ') || 'No hay días con horarios definidos';
    }

    ejecutarReporte(): void {
      this.dataSource.data = [];
      const reporteSeleccionado = this.reportes.find(reporte => reporte.nombre === this.reporteSeleccionado);
      if (reporteSeleccionado) {
        reporteSeleccionado.funcion();
      }
    }

    getDisplayHeaders(): string[] {
      const currentColumnDefs =
        this.reporteSeleccionado === 'Reporte de horas por Dia'
          ? this.displayedColumnsBuscarHorarios
          : this.reporteSeleccionado === 'Reporte Resumen por Empresa'
          ? this.displayedColumnsObtenerResumenPorEmpresa
          : this.displayedColumnsObtenerOrdenes;

      return currentColumnDefs.map(colDefName => this.headerMap[colDefName] || colDefName);
    }

    getCellValue(item: any, columnDefName: string): any {
    switch (this.reporteSeleccionado) {
        case 'Reporte de horas por Dia':
            switch (columnDefName) {
                case 'empresa': return item.ordenTrabajo?.servicio?.nombre || '';
                case 'empleado': return `${item.empleado?.nombre || ''} ${item.empleado?.apellido || ''}`.trim();
                case 'estado': return item.estado || '';
                case 'empleadoSuplente': return `${item.empleadoSuplente?.nombre || ''} ${item.empleadoSuplente?.apellido || ''}`.trim();
                case 'estadoSulente': return item.estadoSuplente || '';
                case 'fecha': return this.datePipe.transform(item.fecha, 'yyyy-MM-dd') || '';
                case 'horasInicioProyectado': return item.horaInicioProyectado || '';
                case 'horasFinProyectado': return item.horaFinProyectado || '';
                case 'horaInicioReal': return item.horaInicioReal || '';
                case 'horaFinReal': return item.horaFinReal || '';
                case 'horasTotales': return item.horasTotales || '';
                
                default: return (item as any)[columnDefName] || '';
            }
        case 'Reporte de horas por Empleado por Empresa':
            switch (columnDefName) {
                case 'empresa': return item.nombreServicio || '';
                case 'horarioAsignado': return item.horario || '';
                case 'dias': return item.dias || '';
                case 'horasAutorizadas': return item.horasAutorizadas || '';
                case 'horasProyectadas': return item.horasProyectadas || '';
                case 'horasTrabajadas': return item.horasTrabajadas || '';
                case 'horasAusentismoPago': return item.horasAusentismoPago || '';
                case 'horasAusentismoNoPago': return item.horasAusentismoNoPago || '';
                default: return (item as any)[columnDefName] || '';
            }
        case 'Reporte Resumen por Empresa':
          switch (columnDefName) {
            case 'empresa': return item.nombreServicio || '';
            case 'horasFijas': return item.horasFijas || '';
            case 'horasProyectadas': return item.horasProyectadas || '';
            case 'horasReales': return item.horasReales || '';
            default: return (item as any)[columnDefName] || '';
          }
        default: return ''; 
    }
    }

   descargarPdf(): void {
    if (!this.dataSource.data || this.dataSource.data.length === 0) {
      console.log('No hay datos para exportar a PDF.');
      return;
    }
    console.log('Reporte Seleccionado', this.reporteSeleccionado);

    const doc = new jsPDF();
    const headers = this.getDisplayHeaders();

    const currentData = this.dataSource.filteredData.slice();
    const sortedData = this.matSort
      ? this.dataSource.sortData(currentData, this.matSort)
      : currentData;

    const rows = sortedData.map(item => {
      const currentColumnDefs = this.reporteSeleccionado === 'Reporte de horas por Dia'
      ? this.displayedColumnsBuscarHorarios
      : this.reporteSeleccionado === 'Reporte Resumen por Empresa'
        ? this.displayedColumnsObtenerResumenPorEmpresa
        : this.displayedColumnsObtenerOrdenes;

      return currentColumnDefs.map(colDefName => this.getCellValue(item, colDefName));
    });

    (doc as any).autoTable({
      head: [headers],
      body: rows,
      startY: 10,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fontSize: 8,
        fillColor: [204, 86, 0],
        textColor: [255, 255, 255],
      },
      margin: { left: 0, right: 0 },
    });

    const finalY = (doc as any).lastAutoTable.finalY;
    const pageHeight = doc.internal.pageSize.getHeight();
    const bottomMargin = 20; // Espacio que se necesita para el resumen

    // Si el espacio restante en la página es menor al margen que necesitamos,
    // agregamos una nueva página.
    if (finalY + bottomMargin > pageHeight) {
      doc.addPage();
      (doc as any).lastAutoTable.finalY = 10; // Reiniciamos la posición para la nueva página
    }

    doc.setFontSize(8);
    const resumenY = (doc as any).lastAutoTable.finalY + 10;

    const reporte = this.reporteSeleccionado.trim().normalize('NFC');
    console.log('Reporte para resumen:', reporte);

    if (reporte === 'Reporte de horas por Dia' ) {
      doc.text('Resumen Total', 12, resumenY);
      doc.text(`Horas Proyectadas: ${this.totalHorasProyectadasGlobal.toFixed(2)}`, 10, resumenY + 10);
      doc.text(`Horas Reales: ${this.totalHorasRealesGlobal.toFixed(2)}`, 10, resumenY + 20);
    }
    else if (reporte === 'Reporte Resumen por Empresa') {
      doc.text('Resumen Total', 12, resumenY);
      doc.text(`Horas Proyectadas: ${this.totalHorasProyectadasGlobal.toFixed(2)}`, 10, resumenY + 10);
      doc.text(`Horas Reales: ${this.totalHorasRealesGlobal.toFixed(2)}`, 10, resumenY + 20);
    }
    else if (reporte === 'Reporte de horas por Empleado por Empresa') {
      doc.text('Resumen Total', 12, resumenY);
      doc.text(`Horas Proyectadas: ${this.totales.horasProyectadas.toFixed(2)}`, 10, resumenY + 10);
      doc.text(`Horas Reales: ${this.totales.horasTrabajadas.toFixed(2)}`, 10, resumenY + 20);
      doc.text(`Horas Reales: ${this.totales.horasAusentismoPago.toFixed(2)}`, 10, resumenY + 30);
      doc.text(`Horas Reales: ${this.totales.horasAusentismoNoPago.toFixed(2)}`, 10, resumenY + 40);
    }

    doc.save(
      'reporte_' +
        this.reporteSeleccionado.replace(/[^a-zA-Z0-9]/g, '_') +
        '_' +
        new Date().getTime() +
        '.pdf'
    );
  }

  
  descargarExcel(): void {
  if (!this.dataSource.data || this.dataSource.data.length === 0) {
    console.log('No hay datos para exportar a Excel.');
    return;
  }

  const headers = this.getDisplayHeaders();

  const currentData = this.dataSource.filteredData.slice(); // Copia segura
  const sortedData = this.matSort
    ? this.dataSource.sortData(currentData, this.matSort)
    : currentData;

  const excelData = sortedData.map(item => {
    const currentColumnDefs = this.reporteSeleccionado === 'Reporte de horas por Dia'
      ? this.displayedColumnsBuscarHorarios
      : this.reporteSeleccionado === 'Reporte Resumen por Empresa'
        ? this.displayedColumnsObtenerResumenPorEmpresa
        : this.displayedColumnsObtenerOrdenes;

    const row: any = {};
    currentColumnDefs.forEach(colDefName => {
      const headerText = this.headerMap[colDefName] || colDefName;
      row[headerText] = this.getCellValue(item, colDefName);
    });
    return row;
  });

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

  const resumenStartRow = excelData.length + 3;

  XLSX.utils.sheet_add_aoa(ws, [
    ['Resumen Total'],
    ['Horas Proyectadas', this.totalHorasProyectadasGlobal.toFixed(2)],
    ['Horas Reales', this.totalHorasRealesGlobal.toFixed(2)],
  ], { origin: `A${resumenStartRow}` });

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

  const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  const data: Blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  });

  FileSaver.saveAs(data, 'reporte_' + this.reporteSeleccionado.replace(/[^a-zA-Z0-9]/g, '_') + '_' + new Date().getTime() + '.xlsx');
}

    
    truncateToTwoDecimals(value: number): string {
      return Math.floor(value * 100) / 100 + ''; 
    }
}
