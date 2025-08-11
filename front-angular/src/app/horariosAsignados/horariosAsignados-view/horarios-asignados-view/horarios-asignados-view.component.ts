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
  empleado: any;
  empleadoId: string = '';

  mes: number = 0;
  anio: number = 0;

  pageSize: number = 6;
  pageIndex: number = 0;
  loading: boolean = true;

  // Nuevas propiedades para el reporte modificado
  diasDelMes: any[] = [];
  servicios: string[] = [];
  displayedColumns: string[] = [];
  
  // Totales
  horasAusentismoPago: number = 0;
  horasAusentismoImpago: number = 0;
  horasTrabajadas: number = 0;
  totalHoras: number = 0;
  horasDiscriminadas: any = {};
  
  // Días trabajados para cálculo de horas categoría
  diasTrabajados: string[] = [];
  horasPorDiaCategoria: number = 0;

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
    this.empleadoId = this.route.snapshot.paramMap.get('id')!;
    this.mes = Number(this.route.snapshot.queryParamMap.get('mes'));
    this.anio = Number(this.route.snapshot.queryParamMap.get('anio')!);

    this.empleadoService.getEmpleadoById(parseInt(this.empleadoId)).subscribe((data: any) => {
      this.empleado = data;
      this.cargarDatos();
    });
  }

  cargarDatos() {
    this.horariosAsignadosService.buscarHorariosPorEmpleado(parseInt(this.empleadoId), this.mes, this.anio).subscribe((data: any) => {
      // Verificar si el servicio devuelve la nueva estructura o la antigua
      if (data.horarios) {
        // Nueva estructura con totales
        this.horariosRealizados = data.horarios || [];
        this.horasAusentismoPago = data.horasAusentismoPago || 0;
        this.horasAusentismoImpago = data.horasAusentismoImpago || 0;
        this.horasTrabajadas = data.horasTrabajadas || 0;
        this.totalHoras = this.horasAusentismoPago + this.horasAusentismoImpago + this.horasTrabajadas;
        this.horasDiscriminadas = data.horasDiscriminadas || {};
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

      this.procesarDatos();
      this.loading = false;
    }, error => {
      console.error('Error cargando datos:', error);
      this.loading = false;
    });
  }

  procesarDatos() {
    
    // Generar todos los días del mes
    this.generarDiasDelMes();
    // Obtener servicios únicos
    this.obtenerServicios();
    // Calcular días trabajados y horas por día categoría
    this.calcularDiasTrabajados();
    // Configurar columnas de la tabla
    this.configurarColumnas();
    // Crear la estructura de datos para la tabla
    this.crearEstructuraDatos();
  }

  generarDiasDelMes() {
    this.diasDelMes = [];
    const diasEnMes = new Date(this.anio, this.mes, 0).getDate();
    
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const fecha = new Date(this.anio, this.mes - 1, dia);
      const nombreDia = this.obtenerNombreDia(fecha.getDay());
      const nombreMes = this.obtenerNombreMes(this.mes - 1);
      
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
    // Primero procesamos los horarios para saber qué días tienen trabajo real
    const diasConTrabajo = new Set<string>();
    
    this.horariosRealizados.forEach(horario => {
      if (horario.horasDecimales && horario.horasDecimales > 0) {
        const fechaHorario = horario.fecha ? horario.fecha.split('T')[0] : null;
        if (fechaHorario) {
          diasConTrabajo.add(fechaHorario);
        }
      } else if (horario.horaInicioReal && horario.horaFinReal) {
        // Si no tiene horasDecimales, calcular las horas
        const horas = this.calcularHorasDecimal(horario.horaInicioReal, horario.horaFinReal);
        if (horas > 0) {
          const fechaHorario = horario.fecha ? horario.fecha.split('T')[0] : null;
          if (fechaHorario) {
            diasConTrabajo.add(fechaHorario);
          }
        }
      }
    });
    
    const totalDiasRealesTrabajados = diasConTrabajo.size;
    
    // Calcular horas por día categoría = horas totales / días realmente trabajados
    if (totalDiasRealesTrabajados > 0 && this.empleado?.horasCategoria) {
      this.horasPorDiaCategoria = this.empleado.horasCategoria / totalDiasRealesTrabajados;
    } else {
      this.horasPorDiaCategoria = 0;
      console.warn('No se pueden calcular horas por día categoría');
      console.log('- Total días trabajados:', totalDiasRealesTrabajados);
      console.log('- Horas categoría:', this.empleado?.horasCategoria);
    }
    
    // Guardamos los días trabajados para referencia (ahora son las fechas reales)
    this.diasTrabajados = Array.from(diasConTrabajo);
  }

  configurarColumnas() {
    this.displayedColumns = ['dia', 'horasCategoria'];
    this.servicios.forEach(servicio => {
      this.displayedColumns.push(this.getServicioColumnName(servicio));
    });
  }

  crearEstructuraDatos() {
    console.log('Creando estructura de datos...');
    this.horariosRealizados.forEach((horario, index) => {
      console.log(`Procesando horario ${index + 1}:`, horario);
      
      const fechaHorario = horario.fecha ? horario.fecha.split('T')[0] : null;
      console.log('Fecha del horario:', fechaHorario);
      
      if (!fechaHorario) {
        console.warn('Horario sin fecha válida:', horario);
        return;
      }
      
      const diaEncontrado = this.diasDelMes.find(dia => dia.fechaString === fechaHorario);
      console.log('Día encontrado:', diaEncontrado ? diaEncontrado.displayName : 'No encontrado');
      
      if (diaEncontrado) {
        const nombreServicio = horario.ordenTrabajo?.servicio?.nombre || 'Sin Servicio';
        console.log('Servicio:', nombreServicio);
        
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

    // Asignar horas categoría solo a días que realmente trabajaron
    let diasConHorasCategoria = 0;
    this.diasDelMes.forEach(dia => {
      // Verificar si este día específico tiene trabajo real
      const tieneHoras = Object.values(dia.horasPorServicio).some(horas => (horas as number) > 0);
      
      if (tieneHoras) {
        dia.horasCategoria = this.horasPorDiaCategoria;
        diasConHorasCategoria++;
        console.log(`Día ${dia.displayName}: asignadas ${this.horasPorDiaCategoria.toFixed(4)} horas categoría`);
      } else {
        dia.horasCategoria = 0;
        console.log(`Día ${dia.displayName}: sin horas de trabajo, no se asignan horas categoría`);
      }
    });
    
    // Asignar al dataSource
    this.dataSource.data = [...this.diasDelMes]; // Crear una nueva referencia
    
    // Forzar detección de cambios
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

  descargarPdf(): void {
    const doc = new jsPDF('landscape'); // Orientación horizontal

    // Título
    doc.setFontSize(12);
    doc.text(`Reporte Detallado - ${this.empleado.nombre} ${this.empleado.apellido} (Legajo: ${this.empleado.legajo})`, 14, 15);
    doc.text(`${this.nombreMes} ${this.anio}`, 14, 25);

    // Preparar columnas dinámicas
    const columnas = ['Día', 'H. Categoría'];
    this.servicios.forEach(servicio => {
      columnas.push(servicio.length > 12 ? servicio.substring(0, 12) + '...' : servicio);
    });

    // Preparar filas
    const filas = this.diasDelMes.map(dia => {
      const fila = [dia.displayName, dia.horasCategoria.toFixed(2)];
      this.servicios.forEach(servicio => {
        fila.push((dia.horasPorServicio[servicio] || 0).toFixed(2));
      });
      return fila;
    });

    // Agregar fila de totales
    const filaTotales = ['TOTALES', this.getTotalHorasCategoria().toFixed(2)];
    this.servicios.forEach(servicio => {
      filaTotales.push(this.getTotalPorServicio(servicio).toFixed(2));
    });
    filas.push(filaTotales);

    (doc as any).autoTable({
      head: [columnas],
      body: filas,
      startY: 35,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [204, 86, 0], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 40 } // Ancho fijo para la columna de días
      }
    });

    const finalY = (doc as any).autoTable.previous.finalY || 35;

    // Resumen final
    doc.setFontSize(10);
    let currentY = finalY + 15;

    doc.text('RESUMEN:', 14, currentY);
    currentY += 10;

    doc.text(`Horas Ausentismo Pago: ${this.horasAusentismoPago.toFixed(2)}`, 14, currentY);
    currentY += 7;

    doc.text(`Horas Ausentismo Impago: ${this.horasAusentismoImpago.toFixed(2)}`, 14, currentY);
    currentY += 7;

    doc.text(`Total Horas Trabajadas: ${this.horasTrabajadas.toFixed(2)}`, 14, currentY);
    currentY += 7;

    doc.text(`Total Horas: ${this.totalHoras.toFixed(2)}`, 14, currentY);
    currentY += 10;

    doc.text('HORAS DISCRIMINADAS:', 14, currentY);
    currentY += 7;

    Object.keys(this.horasDiscriminadas).forEach(estado => {
      doc.text(`${estado}: ${this.horasDiscriminadas[estado].toFixed(2)}`, 14, currentY);
      currentY += 5;
    });

    // Nombre del archivo
    const nombreLimpio = this.empleado.nombre?.replace(/\s+/g, '_').toLowerCase() || '';
    const apellidoLimpio = this.empleado.apellido?.replace(/\s+/g, '_').toLowerCase() || '';
    const nombreArchivo = `reporte_detallado_${this.nombreMes}_${nombreLimpio}_${apellidoLimpio}.pdf`;

    doc.save(nombreArchivo);
  }

  descargarExcel(): void {
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
    const nombreArchivo = `reporte_detallado_${this.nombreMes}_${nombreLimpio}_${apellidoLimpio}_${new Date().getTime()}.xlsx`;

    FileSaver.saveAs(blob, nombreArchivo);
  }
}