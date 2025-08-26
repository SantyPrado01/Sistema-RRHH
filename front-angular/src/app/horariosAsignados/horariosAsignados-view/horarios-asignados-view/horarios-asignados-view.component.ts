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

  horasCategoria: number = 0; // Horas categoría del empleado

  constructor(
    private route: ActivatedRoute,
    private horariosAsignadosService: HorariosAsignadosService,
    private empleadoService: EmpleadoService,
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
      this.horasCategoria = this.empleado.horasCategoria || 0;
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
    this.generarDiasDelMes();
    this.obtenerServicios();
    this.calcularDiasTrabajados();
    this.configurarColumnas();
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

  descargarPdf(): void {
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
        doc.text(`Reporte Detallado - ${this.empleado.nombre} ${this.empleado.apellido} (Legajo: ${this.empleado.legajo}) / ${this.nombreMes} ${this.anio}${tituloHoja}`, margin, 15);

        // Preparar columnas dinámicas para esta hoja
        const columnas = ['Día', 'H. Cat'];
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

        const finalY = (doc as any).autoTable.previous.finalY || 20;
        let currentY = finalY + 6;

        // Solo agregar el resumen en la última hoja
        if (indexHoja === serviciosChunks.length - 1) {
            // Calcular el espacio necesario para el resumen completo de manera más precisa
            const primeraColumnaEstados = ['Asistió', 'Enfermedad', 'Vacaciones'];
            const segundaColumnaEstados = Object.keys(this.horasDiscriminadas)
                .filter(e => !primeraColumnaEstados.includes(e));
            
            // Contar estados reales con valores
            const filasColumna1 = primeraColumnaEstados.filter(e => this.horasDiscriminadas[e] !== undefined).length;
            const filasColumna2 = segundaColumnaEstados.filter(e => this.horasDiscriminadas[e] !== undefined).length;
            
            // El espacio real será determinado por la columna más alta
            const filasHorasDiscriminadas = Math.max(filasColumna1, filasColumna2);
            
            // Espacio necesario más preciso
            const espacioTituloHoras = 6;  // Solo título "HORAS DISCRIMINADAS"
            const espacioTituloResumen = 6; // Solo título "Resumen Final"
            const espacioHorasDiscriminadas = filasHorasDiscriminadas * 6; // Líneas de horas discriminadas
            const espacioResumenFinal = 5 * 6; // 5 filas del resumen final (sin contar título)
            
            // El espacio total es el mayor entre las dos secciones más sus títulos
            const espacioSeccionIzquierda = espacioTituloHoras + espacioHorasDiscriminadas;
            const espacioSeccionDerecha = espacioTituloResumen + espacioResumenFinal;
            const espacioTotalNecesario = Math.max(espacioSeccionIzquierda, espacioSeccionDerecha) + 5; // margen mínimo

            // Verificar si necesitamos una nueva página (más permisivo)
            if (currentY > pageHeight - 40) {  
                doc.addPage();
                currentY = margin;
            }

            // === COLUMNA IZQUIERDA: HORAS DISCRIMINADAS DIVIDIDA EN DOS ===
            doc.setFontSize(8);
            doc.setFont('bold');
            doc.text('HORAS DISCRIMINADAS:', leftColumnX, currentY);
            doc.setFont('normal');

            let leftCurrentY = currentY + 5;
            let middleColumnX = leftColumnX + (columnWidth / 2);

            doc.setFontSize(8);

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
    const nombreArchivo = `informe_mensual_${this.nombreMes}_${nombreLimpio}_${apellidoLimpio}.pdf`;

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