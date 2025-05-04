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

  fecha: string = '';
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


  reportes:{ nombre: string, funcion: ()=> void }[] = [
    {nombre:'Reporte de horas por Empleado por Empresa', funcion: this.obtenerOrdenesMesAnio.bind(this)},
    {nombre:'Reporte de horas por Dia', funcion: this.buscarHorarios.bind(this)},
  ];

  headerMap: { [key: string]: string } = {
    'empresa': 'Empresa', // Común
    'empleado': 'Empleado', // Común
    'fecha': 'Fecha', // Solo en BuscarHorarios
    'horasInicioProyectado': 'Horas Inicio Proyectado', // Solo en BuscarHorarios
    'horasFinProyectado': 'Horas Fin Proyectado',       // Solo en BuscarHorarios
    'horaInicioReal': 'Horas Inicio Real',             // Solo en BuscarHorarios
    'horaFinReal': 'Horas Fin Real',                   // Solo en BuscarHorarias
    'estado': 'Estado', 
    'horasReales': 'Horas Reales', 
    'dias': 'Dias', // Solo en ObtenerOrdenesMesAnio
    'horasProyectadas': 'Horas Proyectadas', // Solo en ObtenerOrdenesMesAnio
  };

  displayedColumnsBuscarHorarios: string[] = [
    'empresa',
    'empleado',
    'fecha',
    'horasInicioProyectado',
    'horasFinProyectado',
    'horaInicioReal',
    'horaFinReal',
    'estado' 
  ];

  displayedColumnsObtenerOrdenes: string[] = [
    'empresa',
    'empleado',
    'dias',
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

  private matSort!: MatSort;
  @ViewChild(MatSort) set matSortSetter(ms: MatSort) {
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

    buscarHorarios(): void {
    this.dataSource.data = [];
    this.loading = true;
    let fechaFormateada: string | null = null;
    if (this.fecha) {
      fechaFormateada = this.datePipe.transform(this.fecha, 'yyyy-MM-dd');
    }

    this.horariosAsignadosService.buscarHorarios(fechaFormateada || '', this.empleadoId, this.servicioId).subscribe(
      (data: any[]) => {
        console.log('Datos recibidos:', fechaFormateada, this.empleadoId, this.servicioId);
        this.dataSource.data = data;
        console.log('Resultado:', data);
        this.loading = false; 
      },
      (error) => {
        console.error('Error al buscar horarios:', error);
        this.loading = false;
      }
    );
    }

    obtenerOrdenesMesAnio() {
    this.dataSource.data = [];
    const mesNumero = this.convertirMesANumero(this.mesSeleccionado);
    this.ordenTrabajoService.getOrdenesPorMesAnio(mesNumero, this.anioSeleccionado).subscribe(
      (data: any[]) => {
        
        this.dataSource.data = data;
        console.log('Datos recibidos:', data);
      },
      (error) => {
        console.error('Hubo un error al obtener las órdenes de trabajo', error);
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
    
    const currentColumnDefs = this.reporteSeleccionado === 'Reporte de horas por Dia'
        ? this.displayedColumnsBuscarHorarios 
        : this.displayedColumnsObtenerOrdenes; 

    return currentColumnDefs.map(colDefName => {
        
        if (colDefName === 'horasReales') {
            
            if (this.reporteSeleccionado === 'Reporte de horas por Dia') {
                return 'Estado';
            }
           
             else if (this.reporteSeleccionado === 'Reporte de horas por Empleado por Empresa') {
                return 'Horas Reales'; 
             }
        }
        
        return this.headerMap[colDefName] || colDefName; 
    });
    }

    getCellValue(item: any, columnDefName: string): any {
    switch (this.reporteSeleccionado) {
        case 'Reporte de horas por Dia':
            switch (columnDefName) {
                case 'empresa': return item.ordenTrabajo?.servicio?.nombre || '';
                case 'empleado': return `${item.empleado?.nombre || ''} ${item.empleado?.apellido || ''}`.trim();
                case 'fecha': return this.datePipe.transform(item.fecha, 'yyyy-MM-dd') || '';
                case 'horasInicioProyectado': return item.horaInicioProyectado || '';
                case 'horasFinProyectado': return item.horaFinProyectado || '';
                case 'horaInicioReal': return item.horaInicioReal || '';
                case 'horaFinReal': return item.horaFinReal || '';
                case 'estado': return item.estado || '';
                
                default: return (item as any)[columnDefName] || '';
            }
        case 'Reporte de horas por Empleado por Empresa':
            switch (columnDefName) {
                case 'empresa': return item.servicio?.nombre || '';
                case 'empleado': return `${item.empleadoAsignado?.nombre || ''} ${item.empleadoAsignado?.apellido || ''}`.trim();
                case 'dias': return item.horasProyectadasCalculadas || item.horasProyectadas || '';
                case 'horasProyectadas': return item.horasProyectadasCalculadas || item.horasProyectadas || '';
                
                case 'horasReales': return item.horasRealesCalculadas || item.horasReales || '';

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

    const doc = new jsPDF();
    const headers = this.getDisplayHeaders(); 

    const rows = this.dataSource.data.map(item => {
      
      const currentColumnDefs = this.reporteSeleccionado === 'Reporte de horas por Dia'
          ? this.displayedColumnsBuscarHorarios
          : this.displayedColumnsObtenerOrdenes; 

      return currentColumnDefs.map(colDefName => {
        return this.getCellValue(item, colDefName); 
      });
    });

    (doc as any).autoTable({
      head: [headers], 
      body: rows,     
      
      startY: 10, 
      styles: { fontSize: 8 },
      headStyles: { fillColor: [204, 86, 0], textColor: [255, 255, 255] }, 
      
    });

    // Guarda el archivo PDF
    doc.save('reporte_' + this.reporteSeleccionado.replace(/[^a-zA-Z0-9]/g, '_') + '_' + new Date().getTime() + '.pdf');
    }
  
    descargarExcel(): void {
      if (!this.dataSource.data || this.dataSource.data.length === 0) {
         console.log('No hay datos para exportar a Excel.');  
         return;
       }

      const headers = this.getDisplayHeaders(); 

      const excelData = this.dataSource.data.map(item => {
         const currentColumnDefs = this.reporteSeleccionado === 'Reporte de horas por Dia'
             ? this.displayedColumnsBuscarHorarios
             : this.displayedColumnsObtenerOrdenes; 

         const row: any = {};
         currentColumnDefs.forEach(colDefName => {
            
            const headerText = this.headerMap[colDefName] || colDefName;
            row[headerText] = this.getCellValue(item, colDefName);
         });
         return row;
       });
      
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte'); 

      const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

      const data: Blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
      FileSaver.saveAs(data, 'reporte_' + this.reporteSeleccionado.replace(/[^a-zA-Z0-9]/g, '_') + '_' + new Date().getTime() + '.xlsx');
    }
    
    truncateToTwoDecimals(value: number): string {
      return Math.floor(value * 100) / 100 + ''; 
    }
}
