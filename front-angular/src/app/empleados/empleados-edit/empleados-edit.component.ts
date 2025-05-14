import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoriaEmpleadoService } from '../services/categoria-empleado.service'; 
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { OrdenTrabajoService } from '../../ordenTrabajo/services/orden-trabajo.service';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { MatIconModule } from '@angular/material/icon';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { EmpleadoService } from '../services/empleado.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';

import { MatButtonModule } from '@angular/material/button';
import { OrdenGrupo, OrdenTrabajo } from '../../ordenTrabajo/models/orden-trabajo.models';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { getSpanishPaginatorIntl } from '../../spanish-paginator-intl';
import { HorariosAsignadosService } from '../../horariosAsignados/services/horariosAsignados.service';
import { HorarioAsignado } from '../../horariosAsignados/models/horariosAsignados.models';
import { MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-edit-empleado',
  standalone: true,
  templateUrl: './empleados-edit.component.html',
  providers:[
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: MatPaginatorIntl, useValue: getSpanishPaginatorIntl() },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR' }
  ],
  imports:[
    FormsModule, 
    CommonModule, 
    RouterModule, 
    MatIconModule, 
    MatExpansionModule, 
    MatCardModule, 
    MatButtonModule, 
    MatPaginator,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatFormField,
    MatCheckboxModule,
    MatSelectModule
  ],
  styleUrls: ['./empleados-edit.component.css']
})
export class EditEmpleadoComponent implements OnInit {

  ordenes: any[] = [];
  ordenesFiltradas: any[] = [];
  ordenesMensualesFiltradas: any[] = [];
  ordenesAgrupadas: OrdenGrupo[] = [];
  ordenesAgrupadasPaginadas: OrdenGrupo[] = [];

  horariosRealizados: any[] = [];
  horariosAgrupados: any[] = [];

  seccionActual: string = 'datosPersonales';
  empleado: any = {};
  categorias: any[] = [];
  ciudades: any[] = [];
  categoriaEmpleado: string = '';
  provinciaCórdobaId = 14;
  provinciaSanLuisId = 74;
  provinciaTucumanId = 90;
  provinciaCatamarcaId = 10;
  provinciaLaRiojaId = 46;
  ciudadNombre: string = '';
  contadorCaracteres: number = 0;
  empleadoId: string | null = null;
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => 2024 + i);
  anioSeleccionado: number = new Date().getFullYear(); 
  mesSeleccionado: number = new Date().getMonth() + 1; 
  estadoSeleccionado: boolean = false;

  pageSize: number = 6;
  pageIndex: number = 0;

  filtroEmpresa: string = '';

  totalHorasProyectadas: number = 0;
  totalHorasReales: number = 0;
  totalAsistencias: number = 0;
  totalLT: number = 0;
  totalFC: number = 0;
  totalFS: number = 0;
  totalE: number = 0;

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
    private empleadoService: EmpleadoService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private ordenTrabajoService: OrdenTrabajoService,
    private horariosAsignadosService: HorariosAsignadosService,  
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
      this.obtenerHorarios(Number(this.empleadoId));
      this.getHorasTotales(this.horariosAgrupados)
    };
    this.categoriaEmpleadoService.getCategoriasEmpleados().subscribe({
      next: (data) => {
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener las categorías', err);
      }
    });
  }

  actualizarPagina(){
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.ordenesAgrupadasPaginadas = this.ordenesAgrupadas.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.actualizarPagina();
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

  toggleFullTime() {
    if (this.fullTime) {
      this.disponibilidad.forEach(dia => {
        dia.horaInicio = '';
        dia.horaFin = '';
      });
    }
  }

  obtenerHorasPorMesAnio(mes: number, anio: number) {
    this.ordenTrabajoService.getHorasPorMes(mes, anio).subscribe({
      next: (data) => {
        this.ordenes = data;
        this.ordenes.forEach(orden => {
          orden.horasProyectadas = this.truncateToTwoDecimals(orden.horasProyectadas);
          orden.horasReales = this.truncateToTwoDecimals(orden.horasReales);
        });
        console.log('Total Horas:', this.ordenesMensualesFiltradas);
      }
    });
  }

  cargarEmpleado(empleadoId: string) {
    this.empleadoService.getEmpleadoById(Number(this.empleadoId)).subscribe({
      next: (data) => {
        this.empleado = data;
        console.log('informacion empleado', this.empleado)
        this.fullTime = this.empleado.fulltime || false;
        if (this.empleado.categoria && typeof this.empleado.categoria === 'object'){
          this.empleado.categoria = this.empleado.categoria.id
        }

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
              console.log(this.ciudadNombre)
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
    console.log(url)
    return this.http.get<any>(url);
  }

  seleccionarCiudad(event: any) {
    const selectedCity = this.ciudades.find(c => c.nombre === event.target.value);
    console.log(selectedCity)
    if (selectedCity.nombre == 'Córdoba'){
      this.empleado.ciudad = 14014010; 
      this.ciudadNombre = selectedCity.nombre;
    } 
    else {
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
          console.log(empleadoActualizado)
          this.empleadoService.updateEmpleado(Number(empleadoId), empleadoActualizado).subscribe({
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
      const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${this.provinciaCórdobaId},${this.provinciaSanLuisId},${this.provinciaTucumanId},${this.provinciaCatamarcaId},${this.provinciaLaRiojaId}&nombre=${query}&max=10`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.ciudades = response.localidades.map((localidad: any) => ({
            id: localidad.localidad_censal.id,
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
    this.ordenTrabajoService.getOrdenesForEmpleado(empleadoId).subscribe({
      next: (data) => {
        this.ordenes = data;
        this.ordenesFiltradas = data
        this.calcularTotales()
        this.ordenesAgrupadas = this.agruparOrdenes(this.ordenes);
        this.actualizarPagina();
        console.log('Órdenes obtenidas:', this.ordenesFiltradas);
      },
      error: (err) => {
        console.error('Hubo un error al obtener las órdenes de trabajo', err);
        this.mostrarAlerta('Error', 'No se pudieron obtener las órdenes de trabajo.', 'error');
      }
    });
  }

  obtenerHorarios(empleadoId: number) {
    this.horariosAsignadosService.buscarHorariosPorEmpleado(empleadoId).subscribe((res: any) => {
      const horarios: HorarioAsignado[] = res.horarios;
  
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
    });
  
  }

  calcularTotales(): void {
    this.totalHorasProyectadas = 0;
    this.totalHorasReales = 0;
    this.totalAsistencias = 0;
    this.totalLT = 0;
    this.totalFC = 0;
    this.totalFS = 0;
    this.totalE = 0;
  
    this.ordenesFiltradas.forEach(orden => {
      this.totalHorasProyectadas += orden.horasProyectadas;
      this.totalHorasReales += orden.horasReales;
      this.totalAsistencias += orden.estadoContador.asistio;
      this.totalLT += orden.estadoContador.llegoTarde;
      this.totalFC += orden.estadoContador.faltoConAviso;
      this.totalFS += orden.estadoContador.faltoSinAviso;
      this.totalE += orden.estadoContador.enfermedad;
    });
  }

  private convertirHoraAHoras(horaInicio: string, horaFin: string): number {
    if (!horaInicio || !horaFin) return 0; // Si no hay horas, retornamos 0.
  
    const [inicioH, inicioM] = horaInicio.split(':').map(Number);
    const [finH, finM] = horaFin.split(':').map(Number);
  
    const inicioMinutos = inicioH * 60 + inicioM;
    const finMinutos = finH * 60 + finM;
  
    const totalMinutos = finMinutos - inicioMinutos;
    const totalHoras = totalMinutos / 60;
    
    return totalHoras; // Retornamos el valor en formato numérico
  }
  
  getHorasTotales(horarios: HorarioAsignado[]): number {
    return horarios.reduce((total, h) => {
      return total + this.convertirHoraAHoras(h.horaInicioReal || '', h.horaFinReal || '');
    }, 0);
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
    this.calcularTotales()
  }

  filtrarMensual() {
    const anioSeleccionado = Number(this.anioSeleccionado);
    const mesSeleccionadoNum = this.mesesMap[this.mesSeleccionado];
    
    this.ordenesFiltradas = this.ordenes.filter(orden => {
      const noEliminada = orden.eliminado !== true;
  
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
  
      return noEliminada && coincideEmpresa && coincideMes && coincideAnio && coincideEstado;
    });
    this.calcularTotales()
  }
  
  obtenerDias(necesidades: any[]): string {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'];
    const diasConHorario = necesidades
      .filter(n => n.horaInicio !== "00:00:00" && n.horaFin !== "00:00:00")
      .map(n => diasSemana[parseInt(n.diaSemana, 10) - 1]) 
      .filter((dia, index, self) => dia && self.indexOf(dia) === index);
    return diasConHorario.join(', ') || 'No hay días con horarios definidos';
  }

  getNombreMes(mes: number): string {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1];
  }

  cancelar() {
    this.mostrarAlerta('Operacion Cancelada', 'Empleado NO actualizado.', 'success');
    this.router.navigate(['/employee']);
  }

  descargarPdf(): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text('Resumen de Cierre Mensual', 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Horas Proyectadas: ${this.totalHorasProyectadas}`, 20, 40);
    doc.text(`Horas Reales: ${this.totalHorasReales}`, 120, 40);
    doc.text(`Asistencias: ${this.totalAsistencias}`, 20, 60);
    doc.text(`Llegada Tarde: ${this.totalLT}`, 20, 70);
    doc.text(`Faltaron con Aviso: ${this.totalFC}`, 20, 80);
    doc.text(`Faltaron sin Aviso: ${this.totalFS}`, 20, 90);
    doc.text(`Enfermedad: ${this.totalE}`, 20, 100);

    const columns = ['Orden N°', 'Servicio', 'Horas Proyectadas', 'Horas Reales', 'A', 'LT', 'FC', 'FS', 'E'];
    const rows = this.ordenesFiltradas.map(orden => [
      orden.Id,
      orden.servicio.nombre,
      orden.horasProyectadas,
      orden.horasReales,
      orden.estadoContador.asistio,
      orden.estadoContador.llegoTarde,
      orden.estadoContador.faltoConAviso,
      orden.estadoContador.faltoSinAviso,
      orden.estadoContador.enfermedad
    ]);

    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 110, 
      theme: 'grid',
      headStyles: {
        fillColor: [255, 186, 140], 
        textColor: [0, 0, 0],        
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 10,
        textColor: [0, 0, 0],
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240] 
      },
      margin: { top: 50 }, 
      styles: {
        overflow: 'linebreak',
        font: 'helvetica'
      }
    });

    doc.save('cierre_mensual.pdf');
  }

  descargarExcel(): void {
  
    const columnas = ['Orden N°', 'Servicio', 'Horas Proyectadas', 'Horas Reales', 'A', 'LT', 'FC', 'FS', 'E'];

    const filas = this.ordenesFiltradas.map(orden => [
      orden.Id,
      orden.servicio.nombre,
      orden.horasProyectadas,
      orden.horasReales,
      orden.estadoContador.asistio,
      orden.estadoContador.llegoTarde,
      orden.estadoContador.faltoConAviso,
      orden.estadoContador.faltoSinAviso,
      orden.estadoContador.enfermedad
    ]);

    const totales = [
      '',
      'Totales',
      this.totalHorasProyectadas,
      this.totalHorasReales,
      this.totalAsistencias,
      this.totalLT,
      this.totalFC,
      this.totalFS,
      this.totalE
    ];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([columnas, ...filas, [], totales]);

    const wb: XLSX.WorkBook = { Sheets: { 'Resumen Mensual': ws }, SheetNames: ['Resumen Mensual'] };

    XLSX.writeFile(wb, 'cierre_mensual.xlsx');
  }
  
  truncateToTwoDecimals(value: number): string {
    return Math.floor(value * 100) / 100 + ''; 
  }

}
