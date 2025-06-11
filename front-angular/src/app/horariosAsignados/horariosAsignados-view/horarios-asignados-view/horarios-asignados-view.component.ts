import { Component, ViewChild } from '@angular/core';
import { NavbarComponent } from '../../../nabvar/navbar.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { CommonModule, DatePipe } from '@angular/common';
import { ServicioService } from '../../../servicios/services/servicio.service';
import { HorariosAsignadosService } from '../../services/horariosAsignados.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, filter, switchMap } from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatAutocomplete, MatAutocompleteModule } from '@angular/material/autocomplete';
import { Empresa } from '../../../servicios/models/servicio.models';
import { MatInputModule } from '@angular/material/input';
import { EmpleadoService } from '../../../empleados/services/empleado.service';
import { MatButtonModule } from '@angular/material/button';
import { getSpanishPaginatorIntl } from '../../../spanish-paginator-intl';
import { MatDialog } from '@angular/material/dialog';
import { DialogObservacionesComponent } from '../../../Modales/dialog-observaciones/dialog-observaciones.component';
import { MatBadgeModule } from '@angular/material/badge';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-horarios-asignados-view',
  standalone: true,
  imports: [
    NavbarComponent, 
    MatIconModule, 
    RouterModule, 
    MatProgressSpinner, 
    MatPaginator, 
    CommonModule, 
    MatTableModule, 
    MatSortModule, 
    MatOptionModule, 
    MatFormFieldModule, 
    MatAutocompleteModule, 
    MatLabel, 
    FormsModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatBadgeModule
  ],
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() }
  ],
  templateUrl: './horarios-asignados-view.component.html',
  styleUrl: './horarios-asignados-view.component.css'
})
export class HorariosAsignadosViewComponent {

  dataSource = new MatTableDataSource<any>([]);

  horariosRealizados: any[] = [];
  horasRealizadas: any[] = [];
  empresaControl = new FormControl('');
  empleadoControl = new FormControl('');
  empresasFiltradas: any[] = [];
  servicioId?: number;
  empleado: any;

  mes: number = 0;
  anio: number = 0;

  pageSize: number = 6;
  pageIndex: number = 0;
  loading: boolean = true;
  totalHorasRealizadas: number = 0;
  totalAsistencias: number = 0;
  totalLT: number = 0;
  totalFC: number = 0;
  totalFS: number = 0;
  totalE: number = 0;

  displayedColumns: string[] = [
    'ordenTrabajo',
    'fecha',
    'empresa',
    'horasInicioProyectado',
    'horasFinProyectado',
    'horaInicioReal',
    'horaFinReal',
    'totalHoras',
    'estado',
    'observaciones'
  ];
  

  constructor(
    private empresaService: ServicioService,
    private route: ActivatedRoute,
    private horariosAsignadosService: HorariosAsignadosService,
    private empleadoService: EmpleadoService,
    private dialog: MatDialog,

  ) {}

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

  ngOnInit() {
    const empleadoId = this.route.snapshot.paramMap.get('id')!;
    this.mes = Number(this.route.snapshot.queryParamMap.get('mes'));
    this.anio = Number(this.route.snapshot.queryParamMap.get('anio')!);

    this.empleadoService.getEmpleadoById(parseInt(empleadoId)).subscribe((data: any) => {
      this.empleado = data;
    })


    this.horariosAsignadosService.buscarHorariosPorEmpleado(parseInt(empleadoId), this.mes, this.anio).subscribe((data: any) => {
      this.horariosRealizados = data
      console.log(this.horariosRealizados)
      this.horasRealizadas = data.horarios.map((item: any) => {
        if (item.horaInicioReal && item.horaFinReal) {
          item.horasTotales = this.calcularHorasDecimal(item.horaInicioReal, item.horaFinReal);
        } else {
          item.horasTotales = 0;
        }
        return item;
      });
  
      this.dataSource.data = data.horarios;
      console.log(this.dataSource.data)
      this.totalAsistencias = data.conteo.Asistió;
      this.totalLT = data.conteo.llegoTarde;
      this.totalFC = data.conteo.faltoConAviso;
      this.totalFS = data.conteo.faltoSinAviso;
      this.totalE = data.conteo.enfermedad;

      this.totalHorasRealizadas = data.horarios
      .filter((item: any) => item.horaInicioReal && item.horaFinReal)
      .reduce((sum: number, item: any) => {
        return sum + this.calcularHorasDecimal(item.horaInicioReal, item.horaFinReal);
      }, 0);

      this.loading = false;
    });

    this.empresaControl.valueChanges
      .pipe(
        debounceTime(300),
        filter(value => typeof value === 'string'), 
        switchMap(value => this.empresaService.buscarEmpresas(value))
      )
      .subscribe(result => {
        this.empresasFiltradas = result;
        console.log('Empresas filtradas:', this.empresasFiltradas);
      });
  }

  calcularHorasDecimal(horaInicio: string, horaFin: string): number {
    const [hInicio, mInicio] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);
  
    const inicioEnMinutos = hInicio * 60 + mInicio;
    const finEnMinutos = hFin * 60 + mFin;
  
    const diferenciaMinutos = finEnMinutos - inicioEnMinutos;
    const horasDecimales = diferenciaMinutos / 60;
  
    return parseFloat(horasDecimales.toFixed(2)); 
  }
  

  seleccionarEmpresa(empresa: any): void {
    console.log('Empresa seleccionada:', empresa);
  
    this.servicioId = empresa.servicioId;  
  }

  obtenerHorariosRealizados(empleadoId: number, mes: number, anio: number) {
    this.horariosAsignadosService.buscarHorariosPorEmpleado(empleadoId, mes, anio).subscribe()
  }

  displayEmpleadoName = (empleado: any): string => {
    return empleado ? `${empleado.nombre} ${empleado.apellido}` : '';
  };
  
  displayEmpresaName = (empresa: any): string => {
    return empresa ? empresa.nombre : '';
  };

  get nombreMes(): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
  
    return `${meses[this.mes - 1]}`;
  }

  abrirDialogoObservaciones(observacion: string): void {
    if (!observacion) return;
  
    this.dialog.open(DialogObservacionesComponent, {
      width: '400px',
      data: { observacion },
    });
  }

  descargarPdf(): void {
    const doc = new jsPDF();

    // Puedes agregar un título al PDF si lo deseas
    doc.text(`Reporte de Horarios - ${this.empleado.nombre} ${this.empleado.apellido} - ${this.nombreMes} ${this.anio}`, 14, 10);


    const columnas = ['N° Orden', 'Fecha', 'Empresa', 'H. Inicio Proy.', 'H. Fin Proy.', 'H. Inicio Real', 'H. Fin Real', 'Total Horas', 'Estado'];
    const filas = this.dataSource.data.map((item: any) => [
      item.ordenTrabajo.Id,
      item.fecha ? item.fecha.split('T')[0] : '', // Asegúrate de que fecha exista
      item.ordenTrabajo && item.ordenTrabajo.servicio ? item.ordenTrabajo.servicio.nombre : '', // Manejo de nulos
      item.horaInicioProyectado,
      item.horaFinProyectado,
      item.horaInicioReal,
      item.horaFinReal,
      item.horasTotales,
      item.estado 
    ]);

    (doc as any).autoTable({
      head: [columnas],
      body: filas,
      startY: 20, // Ajusta el inicio para dejar espacio al título si lo agregaste
      styles: { fontSize: 8 },
      headStyles: { fillColor: [204, 86, 0], textColor: [255, 255, 255] },
    });
    const finalY = (doc as any).autoTable.previous.finalY || 10; // Obtiene el Y final de la tabla, si no hay tabla usa 10

    // 5. Agregar los totales al final del PDF
    const margenIzquierdo = 14;
    let currentY = finalY + 10; // Deja un espacio de 10 unidades debajo de la tabla

    doc.setFontSize(10); // Tamaño de fuente para los totales

    doc.text(`Resumen de Horarios:`, margenIzquierdo, currentY);
    currentY += 7; // Espacio entre el título y el primer total

    doc.text(`Total Horas Realizadas: ${this.totalHorasRealizadas.toFixed(2)}`, margenIzquierdo, currentY);
    currentY += 7;

    doc.text(`Total Asistencias: ${this.totalAsistencias}`, margenIzquierdo, currentY);
    currentY += 7;

    doc.text(`Total Llegadas Tarde (LT): ${this.totalLT}`, margenIzquierdo, currentY);
    currentY += 7;

    doc.text(`Total Faltas con Aviso (FC): ${this.totalFC}`, margenIzquierdo, currentY);
    currentY += 7;

    doc.text(`Total Faltas sin Aviso (FS): ${this.totalFS}`, margenIzquierdo, currentY);
    currentY += 7;

    doc.text(`Total por Enfermedad (E): ${this.totalE}`, margenIzquierdo, currentY);
    currentY += 7;

    if (this.empleado && this.empleado.nombre && this.empleado.apellido) {

      const nombreLimpio = this.empleado.nombre.replace(/\s+/g, '_').toLowerCase();
      const apellidoLimpio = this.empleado.apellido.replace(/\s+/g, '_').toLowerCase();

      const nombreArchivo = `reporte_${this.nombreMes}_${nombreLimpio}_${apellidoLimpio}.pdf`;

      doc.save(nombreArchivo);
    } else {
      doc.save(`reporte_${this.nombreMes}_${this.anio}.pdf`);
      console.warn('No se pudo obtener el nombre/apellido del empleado para el nombre del archivo. Usando nombre genérico.');
    }
  }

  descargarExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource.data.map((item: any) => ({
      'N° Orden': item.ordenTrabajo.Id,
      'Fecha': item.fecha.split('T')[0],
      'Empresa': item.ordenTrabajo.servicio.nombre,
      'Hora Inicio Proyectado': item.horasInicioProyectado,
      'Hora Fin Proyectado': item.horasFinProyectado,
      'Hora Inicio Real': item.horaInicioReal,
      'Hora Fin Real': item.horaFinReal,
      'Total Horas': item.horasTotales,
      'Estado': item.estado
    })));

    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'reporte' + '_' + new Date().getTime() + '.xlsx');
  }

  

}
