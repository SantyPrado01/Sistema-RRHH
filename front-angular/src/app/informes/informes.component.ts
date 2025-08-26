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

  //Reporte Mensual Empleado Variables
  horariosRealizados: any[] = [];
  diasDelMes: any[] = [];
  servicios: string[] = [];
  displayedColumns: string[] = [];
  horasAusentismoPago: number = 0;
  horasAusentismoImpago: number = 0;
  totalHorasPorServicio: any = {};
  horasCategoria: number = 0;
  horasTrabajadas: number = 0;
  totalHoras: number = 0;
  horasDiscriminadas: any = {};
  diasTrabajados: string[] = [];
  horasPorDiaCategoria: number = 0;
  mes: number = 0;
  empleado: any;
  

  reportes:{ nombre: string, funcion: ()=> void }[] = [
    {nombre:'Resumen por Empresa', funcion: this.reusmenPorEmpresa.bind(this)},
    {nombre:'Reporte de horas por Dia', funcion: this.reporteHorasPorDia.bind(this)},
    {nombre:'Informe mensual empleado', funcion: this.buscarHorariosPorEmpleado.bind(this)},
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
    'horarioAsignado': 'Horario Asignado', // Solo en ObtenerOrdenesMesAnio
    'horasFijas': 'Horas Fijas', // Solo en Resumen por Empresa
    'horasTrabajadas': 'Horas Trabajadas', // Solo en Resumen por Empresa
    'horasAutorizadas': 'Horas Autorizadas', // Solo en ObtenerOrdenesMesAnio
    'horasAusentismoPago': 'Horas Ausentismo Pago', // Solo en ObtenerOrdenesMesAnio
    'horasAusentismoNoPago': 'Horas Ausentismo No Pago', // Solo en ObtenerOrdenesMesAnio
  };

  displayedColumnsHorasPorDia: string[] = [
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

  displayedColumnsResumenPorEmpresa: string[] = [
    'empresa',
    'horarioAsignado',
    'dias',
    'horasAutorizadas',
    'horasProyectadas',
    'horasTrabajadas',
    'horasAusentismoPago',
    'horasAusentismoNoPago',
  ]

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
      return empleado ? `${empleado.nombre} ${empleado.apellido || ''}` : '';
    }

    seleccionarEmpresa(empresa: any): void {
      console.log('Empresa seleccionada:', empresa);
      this.servicioId = empresa.servicioId;  
    }

    displayEmpresaName(empresa: Empresa): string {
      return empresa ? empresa.nombre: '';
    }

  //Funcion reporte de horas por dia  
  reporteHorasPorDia(): void {
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
              return 0;
            }

            const parts = timeString.split(':'); // puede ser ["HH","mm"] o ["HH","mm","ss"]

            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            const seconds = parts.length === 3 ? parseInt(parts[2], 10) : 0;

            if (isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
              console.warn('Formato de hora inválido:', timeString);
              return 0;
            }

            return (hours * 60) + minutes + Math.floor(seconds / 60); // segundos redondeados a minutos
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
  //Funcion reporte por empresa   
  reusmenPorEmpresa() {
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
          ? this.displayedColumnsHorasPorDia
          : this.reporteSeleccionado === 'Resumen por Empresa'
          ? this.displayedColumnsResumenPorEmpresa
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
                case 'horasInicioProyectado': return item.horaInicioProyectado?.substring(0,5) || '';
                case 'horasFinProyectado': return item.horaFinProyectado?.substring(0,5) || '';
                case 'horaInicioReal': return item.horaInicioReal?.substring(0,5) || '';
                case 'horaFinReal': return item.horaFinReal?.substring(0,5) || '';
                case 'horasTotales': return item.duracionReal || '';
                
                default: return (item as any)[columnDefName] || '';
            }
        case 'Resumen por Empresa':
            switch (columnDefName) {
                case 'empresa': return item.nombreServicio || '';
                case 'horarioAsignado': return item.horario || '';
                case 'dias': return item.dias || '';
                case 'horasAutorizadas': return item.horasAutorizadas || '';
                case 'horasProyectadas': return item.horasProyectadas.toFixed(2) || '';
                case 'horasTrabajadas': return item.horasTrabajadas.toFixed(2) || '';
                case 'horasAusentismoPago': return item.horasAusentismoPago.toFixed(2) || '';
                case 'horasAusentismoNoPago': return item.horasAusentismoNoPago.toFixed(2) || '';
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

    const isResumenPorEmpresa = this.reporteSeleccionado.trim() === 'Resumen por Empresa';
    const doc = new jsPDF({
      orientation: isResumenPorEmpresa ? 'landscape' : 'portrait'
    });

    const headers = this.getDisplayHeaders();

    const currentData = this.dataSource.filteredData.slice();
    const sortedData = this.matSort
      ? this.dataSource.sortData(currentData, this.matSort)
      : currentData;

    const rows = sortedData.map(item => {
      const currentColumnDefs =
        this.reporteSeleccionado === 'Reporte de horas por Dia'
          ? this.displayedColumnsHorasPorDia
          : this.reporteSeleccionado === 'Resumen por Empresa'
          ? this.displayedColumnsResumenPorEmpresa
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
    const bottomMargin = 20;

    if (finalY + bottomMargin > pageHeight) {
      doc.addPage();
      (doc as any).lastAutoTable.finalY = 10;
    }

    doc.setFontSize(8);
    const resumenY = (doc as any).lastAutoTable.finalY + 10;

    const reporte = this.reporteSeleccionado.trim().normalize('NFC');
    console.log('Reporte para resumen:', reporte);

    if (reporte === 'Reporte de horas por Dia') {
      doc.text('Resumen Total', 12, resumenY);
      doc.text(`Horas Proyectadas: ${this.totalHorasProyectadasGlobal.toFixed(2)}`, 10, resumenY + 10);
      doc.text(`Horas Reales: ${this.totalHorasRealesGlobal.toFixed(2)}`, 10, resumenY + 20);
    } else if (reporte === 'Resumen por Empresa') {
      doc.text('Resumen Total', 12, resumenY);
      doc.text(`Horas Proyectadas: ${this.totales.horasProyectadas.toFixed(2)}`, 10, resumenY + 10);
      doc.text(`Horas Trabajadas: ${this.totales.horasTrabajadas.toFixed(2)}`, 10, resumenY + 20);
      doc.text(`Horas Ausentismo Pago: ${this.totales.horasAusentismoPago.toFixed(2)}`, 10, resumenY + 30);
      doc.text(`Horas Ausentismo No Pago: ${this.totales.horasAusentismoNoPago.toFixed(2)}`, 10, resumenY + 40);
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
      ? this.displayedColumnsHorasPorDia
      : this.reporteSeleccionado === 'Resumen por Empresa'
        ? this.displayedColumnsResumenPorEmpresa
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

  buscarHorariosPorEmpleado(): void {
    this.empleadoService.getEmpleadoById(this.empleadoId ?? 0).subscribe((data: any) => {
      this.empleado = data;
      this.horasCategoria = this.empleado.horasCategoria || 0;
    });
    const mesNumero = this.convertirMesANumero(this.mesSeleccionado);
    this.horariosAsignadosService.buscarHorariosPorEmpleado(this.empleadoId ?? 0, mesNumero, this.anio).subscribe((data: any) => {

      if (data.horarios) {
        // Nueva estructura con totales
        this.horariosRealizados = data.horarios || [];
        this.horasAusentismoPago = data.horasAusentismoPago || 0;
        this.horasAusentismoImpago = data.horasAusentismoImpago || 0;
        this.horasTrabajadas = data.horasTrabajadas || 0;
        this.totalHoras = this.horasAusentismoPago + this.horasAusentismoImpago + this.horasTrabajadas;
        this.horasDiscriminadas = data.horasDiscriminadas || {};
        this.totalHorasPorServicio = data.totalHorasPorServicio || {};
      } else if (Array.isArray(data)) {
        // Estructura antigua - solo array de horarios
        this.horariosRealizados = data;
        this.horasAusentismoPago = 0;
        this.horasAusentismoImpago = 0;
        this.horasTrabajadas = 0;
        this.totalHoras = 0;
        this.horasDiscriminadas = {};
      } else {
        console.error('Estructura de datos no reconocida:', data);
        this.horariosRealizados = [];
      }
      console.log('Horarios realizados:', data);
      
      this.procesarDatos();
      this.loading = false;
    }, error => {
      console.error('Error cargando datos:', error);
      this.loading = false;
    });

  }

  procesarDatos() {
    this.generarDiasDelMes();
    this.obtenerServicios();
    this.calcularDiasTrabajados();
    this.configurarColumnas();
    this.crearEstructuraDatos();
  }

  generarDiasDelMes() {
    this.diasDelMes = [];
    const mesNumero = this.convertirMesANumero(this.mesSeleccionado);
    const diasEnMes = new Date(this.anio, mesNumero, 0).getDate();
    
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(this.anio, mesNumero - 1, dia);
      const nombreDia = this.obtenerNombreDia(fecha.getDay());
      const nombreMes = this.obtenerNombreMes(mesNumero - 1);
      
      this.diasDelMes.push({
        dia: dia,
        fecha: fecha,
        fechaString: fecha.toISOString().split('T')[0],
        displayName: `${nombreDia} ${dia.toString().padStart(2, '0')}-${nombreMes}-${this.anio.toString().slice(-2)}`,
        horasPorServicio: {},
        horasCategoria: 0
      });
    }
  }

  obtenerServicios() {
    const serviciosSet = new Set<string>();
    this.horariosRealizados.forEach(horario => {
      if (horario.ordenTrabajo?.servicio?.nombre) {
        serviciosSet.add(horario.ordenTrabajo.servicio.nombre);
      }
    });
    this.servicios = Array.from(serviciosSet).sort();
  }

  calcularDiasTrabajados() {
    // Procesamos los horarios para saber qué días tienen horas PROYECTADAS
    const diasConHorasProyectadas = new Set<string>();
    
    this.horariosRealizados.forEach(horario => {
      if (horario.horaInicioProyectado && horario.horaFinProyectado) {
        // Calcular las horas proyectadas
        const horasProyectadas = this.calcularHorasDecimal(horario.horaInicioProyectado, horario.horaFinProyectado);
        if (horasProyectadas > 0) {
          const fechaHorario = horario.fecha ? horario.fecha.split('T')[0] : null;
          if (fechaHorario) {
            diasConHorasProyectadas.add(fechaHorario);
          }
        }
      }
    });
    
    const totalDiasConHorasProyectadas = diasConHorasProyectadas.size;
    
    // Calcular horas por día categoría = horas totales / días con horas proyectadas
    if (totalDiasConHorasProyectadas > 0 && this.empleado?.horasCategoria) {
      this.horasPorDiaCategoria = this.empleado.horasCategoria / totalDiasConHorasProyectadas;
    } else {
      this.horasPorDiaCategoria = 0;
      console.warn('No se pueden calcular horas por día categoría');
      console.log('- Total días con horas proyectadas:', totalDiasConHorasProyectadas);
      console.log('- Horas categoría:', this.empleado?.horasCategoria);
    }
    
    // Guardamos los días con horas proyectadas para referencia
    this.diasTrabajados = Array.from(diasConHorasProyectadas);

    console.log('Días con horas proyectadas:', totalDiasConHorasProyectadas);
    console.log('Horas por día categoría:', this.horasPorDiaCategoria);
  }

  configurarColumnas() {
    this.displayedColumns = ['dia', 'horasCategoria'];
    this.servicios.forEach(servicio => {
      this.displayedColumns.push(this.getServicioColumnName(servicio));
    });
  }

  crearEstructuraDatos() {
    this.horariosRealizados.forEach((horario, index) => {
      const fechaHorario = horario.fecha ? horario.fecha.split('T')[0] : null;
      
      if (!fechaHorario) {
        console.warn('Horario sin fecha válida:', horario);
        return;
      }
      
      const diaEncontrado = this.diasDelMes.find(dia => dia.fechaString === fechaHorario);
      
      if (diaEncontrado) {
        const nombreServicio = horario.ordenTrabajo?.servicio?.nombre || 'Sin Servicio';
        
        if (!diaEncontrado.horasPorServicio[nombreServicio]) {
          diaEncontrado.horasPorServicio[nombreServicio] = 0;
        }
        
        // Verificar si el horario ya tiene horasDecimales, si no, calcularlas
        let horas = 0;
        if (horario.horasDecimales !== undefined) {
          horas = horario.horasDecimales;
        } else if (horario.horaInicioReal && horario.horaFinReal) {
          horas = this.calcularHorasDecimal(horario.horaInicioReal, horario.horaFinReal);
        }
        
        console.log('Horas calculadas:', horas);
        diaEncontrado.horasPorServicio[nombreServicio] += horas;
      }
    });

    // Asignar horas categoría a días que tienen horas PROYECTADAS
    let diasConHorasCategoria = 0;
    this.diasDelMes.forEach(dia => {
      // Verificar si este día específico tiene horas proyectadas
      const tieneHorasProyectadas = this.horariosRealizados.some(horario => {
        const fechaHorario = horario.fecha ? horario.fecha.split('T')[0] : null;
        if (fechaHorario === dia.fechaString && horario.horaInicioProyectado && horario.horaFinProyectado) {
          const horasProyectadas = this.calcularHorasDecimal(horario.horaInicioProyectado, horario.horaFinProyectado);
          return horasProyectadas > 0;
        }
        return false;
      });
      
      if (tieneHorasProyectadas) {
        dia.horasCategoria = this.horasPorDiaCategoria;
        diasConHorasCategoria++;
        console.log(`Día ${dia.displayName}: asignadas ${this.horasPorDiaCategoria.toFixed(4)} horas categoría (tiene horas proyectadas)`);
      } else {
        dia.horasCategoria = 0;
        console.log(`Día ${dia.displayName}: sin horas proyectadas, no se asignan horas categoría`);
      }
    });
    
    this.dataSource.data = [...this.diasDelMes]; // Crear una nueva referencia
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  calcularHorasDecimal(horaInicio: string, horaFin: string): number {
    if (!horaInicio || !horaFin) return 0;

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

  obtenerNombreDia(numeroDia: number): string {
    const dias = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
    return dias[numeroDia];
  }

  obtenerNombreMes(numeroMes: number): string {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return meses[numeroMes];
  }

  get nombreMes(): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${meses[this.mes - 1]}`;
  }

  // Calcular totales por servicio
  getTotalPorServicio(servicio: string): number {
    return this.diasDelMes.reduce((total, dia) => {
      return total + (dia.horasPorServicio[servicio] || 0);
    }, 0);
  }

  // Obtener total de horas categoría
  getTotalHorasCategoria(): number {
    return this.diasDelMes.reduce((total, dia) => {
      return total + (dia.horasCategoria || 0);
    }, 0);
  }

  // Función auxiliar para generar nombres de columnas de servicios
  getServicioColumnName(servicio: string): string {
    return `servicio_${servicio.replace(/\s+/g, '_')}`;
  }

  // Función auxiliar para obtener nombre corto de servicio
  getServicioNombreCorto(servicio: string): string {
    return servicio.length > 15 ? servicio.slice(0, 15) + '...' : servicio;
  }

  // Función auxiliar para obtener las claves de un objeto
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  // TrackBy function para optimizar el renderizado
  trackByDia(index: number, dia: any): any {
    return dia.fechaString;
  }

  // TrackBy function para servicios
  trackByServicio(index: number, servicio: string): string {
    return servicio;
  }
    
  truncateToTwoDecimals(value: number): string {
    return Math.floor(value * 100) / 100 + ''; 
  }

  descargarPdfEmpleado(): void {
    const doc = new jsPDF('portrait'); // Orientación vertical
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const columnWidth = (pageWidth - margin * 3) / 2;
    const leftColumnX = margin;
    const rightColumnX = margin * 2 + columnWidth;
    
    const maxServiciosPorHoja = 6;
    const serviciosChunks = [];
    
    // Dividir servicios en chunks de máximo 6
    for (let i = 0; i < this.servicios.length; i += maxServiciosPorHoja) {
        serviciosChunks.push(this.servicios.slice(i, i + maxServiciosPorHoja));
    }

    // Generar cada hoja
    serviciosChunks.forEach((serviciosChunk, indexHoja) => {
        if (indexHoja > 0) {
            doc.addPage();
        }

        // Título
        doc.setFontSize(12);
        const tituloHoja = serviciosChunks.length > 1 ? ` - Hoja ${indexHoja + 1}` : '';
        doc.text(`Reporte Detallado - ${this.empleado.nombre} ${this.empleado.apellido} (Legajo: ${this.empleado.legajo}) / ${this.mesSeleccionado} ${this.anio}${tituloHoja}`, margin, 15);

        // Preparar columnas dinámicas para esta hoja
        const columnas = ['Día', 'H. Categoría'];
        serviciosChunk.forEach(servicio => {
            columnas.push(servicio.length > 10 ? servicio.substring(0, 10) + '...' : servicio);
        });

        // Preparar filas para esta hoja
        const filas = this.diasDelMes.map(dia => {
            const fila = [dia.displayName, dia.horasCategoria.toFixed(2)];
            serviciosChunk.forEach(servicio => {
                const horas = dia.horasPorServicio[servicio] || 0;
                fila.push(horas === 0 ? "" : horas.toFixed(2));
            });
            return fila;
        });

        // Agregar fila de totales para esta hoja
        const filaTotales = ['TOTALES', this.getTotalHorasCategoria().toFixed(2)];
        serviciosChunk.forEach(servicio => {
            filaTotales.push(this.getTotalPorServicio(servicio).toFixed(2));
        });
        filas.push(filaTotales);

        // Tabla principal de la hoja actual
        (doc as any).autoTable({
            head: [columnas],
            body: filas,
            startY: 20,
            styles: { 
                fontSize: 7,
                cellPadding: 2
            },
            headStyles: { 
                fillColor: [204, 86, 0], 
                textColor: [255, 255, 255],
                fontSize: 8
            },
            columnStyles: {
                0: { cellWidth: 25 }, // Día
                1: { cellWidth: 20 }  // H. Categoría
            },
            margin: { left: margin, right: margin }
        });

        const finalY = (doc as any).autoTable.previous.finalY || 35;
        let currentY = finalY + 8;

        // Solo agregar el resumen en la última hoja
        if (indexHoja === serviciosChunks.length - 1) {
            // Verificar si necesitamos una nueva página para el resumen
            if (currentY > pageHeight - 60) {
                doc.addPage();
                currentY = 20;
            }

            // === COLUMNA IZQUIERDA: HORAS DISCRIMINADAS DIVIDIDA EN DOS ===
            doc.setFontSize(8);
            doc.setFont('bold');
            doc.text('HORAS DISCRIMINADAS:', leftColumnX, currentY);
            doc.setFont('normal');

            let leftCurrentY = currentY + 5;
            let middleColumnX = leftColumnX + (columnWidth / 2);

            doc.setFontSize(8);

            // Estados para la primera subcolumna
            const primeraColumnaEstados = ['Asistió', 'Enfermedad', 'Vacaciones'];
            // El resto para la segunda subcolumna
            const segundaColumnaEstados = Object.keys(this.horasDiscriminadas)
                .filter(e => !primeraColumnaEstados.includes(e));

            // Primera subcolumna
            primeraColumnaEstados.forEach(estado => {
                const valor = this.horasDiscriminadas[estado];
                if (valor !== undefined) {
                    doc.text(`${estado}: ${valor.toFixed(2)}`, leftColumnX, leftCurrentY);
                    leftCurrentY += 6;
                }
            });

            // Segunda subcolumna
            let rightColCurrentY = currentY + 5;
            segundaColumnaEstados.forEach(estado => {
                const valor = this.horasDiscriminadas[estado];
                if (valor !== undefined) {
                    doc.text(`${estado}: ${valor.toFixed(2)}`, middleColumnX, rightColCurrentY);
                    rightColCurrentY += 6;
                }
            });

            // === COLUMNA DERECHA: RESUMEN FINAL ===
            let rightCurrentY = currentY;
            
            doc.setFontSize(10);
            doc.setFont('bold');
            doc.text('Resumen Final:', rightColumnX, rightCurrentY);
            doc.setFont('normal');
            rightCurrentY += 6;

            doc.setFontSize(8);
            
            // Horas Ausentismo Pago
            doc.text(`Horas Ausentismo Pago:`, rightColumnX, rightCurrentY);
            doc.text(`${this.horasAusentismoPago.toFixed(2)}`, rightColumnX + 50, rightCurrentY);
            rightCurrentY += 6;

            // Horas Ausentismo Impago
            doc.text(`Horas Ausentismo Impago:`, rightColumnX, rightCurrentY);
            doc.text(`${this.horasAusentismoImpago.toFixed(2)}`, rightColumnX + 50, rightCurrentY);
            rightCurrentY += 6;

            // Total Horas Trabajadas
            doc.text(`Total Horas Trabajadas:`, rightColumnX, rightCurrentY);
            doc.text(`${this.horasTrabajadas.toFixed(2)}`, rightColumnX + 50, rightCurrentY);
            rightCurrentY += 6;

            doc.text(`Horas Categoria:`, rightColumnX, rightCurrentY);
            doc.text(`${this.horasCategoria.toFixed(2)}`, rightColumnX + 50, rightCurrentY);
            rightCurrentY += 6;

            // Total General (destacado)
            doc.setFont('bold');
            doc.setFontSize(10);
            doc.text(`TOTAL GENERAL:`, rightColumnX, rightCurrentY);
            doc.text(`${this.totalHoras.toFixed(2)}`, rightColumnX + 50, rightCurrentY);
        }
    });

    // Nombre del archivo
    const nombreLimpio = this.empleado.nombre?.replace(/\s+/g, '_').toLowerCase() || '';
    const apellidoLimpio = this.empleado.apellido?.replace(/\s+/g, '_').toLowerCase() || '';
    const nombreArchivo = `informe_mensual_${this.mesSeleccionado}_${nombreLimpio}_${apellidoLimpio}.pdf`;

    doc.save(nombreArchivo);
  }

  descargarExcelEmpleado(): void {
      // Preparar datos para Excel
      const datosExcel = this.diasDelMes.map(dia => {
        const fila: any = {
          'Día': dia.displayName,
          'Horas Categoría': dia.horasCategoria.toFixed(2)
        };
        
        this.servicios.forEach(servicio => {
          fila[servicio] = (dia.horasPorServicio[servicio] || 0).toFixed(2);
        });
        
        return fila;
      });
  
      // Agregar fila de totales
      const totales: any = {
        'Día': 'TOTALES',
        'Horas Categoría': this.getTotalHorasCategoria().toFixed(2)
      };
  
      this.servicios.forEach(servicio => {
        totales[servicio] = this.getTotalPorServicio(servicio).toFixed(2);
      });
  
      datosExcel.push(totales);
  
      // Agregar resumen
      datosExcel.push({});
      datosExcel.push({ 'Día': 'RESUMEN' });
      datosExcel.push({ 'Día': 'Horas Ausentismo Pago', 'Horas Categoría': this.horasAusentismoPago.toFixed(2) });
      datosExcel.push({ 'Día': 'Horas Ausentismo Impago', 'Horas Categoría': this.horasAusentismoImpago.toFixed(2) });
      datosExcel.push({ 'Día': 'Total Horas Trabajadas', 'Horas Categoría': this.horasTrabajadas.toFixed(2) });
      datosExcel.push({ 'Día': 'Total Horas', 'Horas Categoría': this.totalHoras.toFixed(2) });
  
      datosExcel.push({});
      datosExcel.push({ 'Día': 'HORAS DISCRIMINADAS' });
      
      Object.keys(this.horasDiscriminadas).forEach(estado => {
        datosExcel.push({ 'Día': estado, 'Horas Categoría': this.horasDiscriminadas[estado].toFixed(2) });
      });
  
      const worksheet = XLSX.utils.json_to_sheet(datosExcel);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  
      const nombreLimpio = this.empleado.nombre?.replace(/\s+/g, '_').toLowerCase() || '';
      const apellidoLimpio = this.empleado.apellido?.replace(/\s+/g, '_').toLowerCase() || '';
      const nombreArchivo = `informe_mensual_${this.nombreMes}_${nombreLimpio}_${apellidoLimpio}.xlsx`;
  
      FileSaver.saveAs(blob, nombreArchivo);
  }
}
