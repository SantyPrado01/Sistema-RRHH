import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CategoriaEmpleadoService } from '../services/categoria-empleado.service'; 
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { OrdenTrabajoService } from '../../ordenTrabajo/services/orden-trabajo.service';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { MatIconModule } from '@angular/material/icon';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-edit-empleado',
  standalone: true,
  templateUrl: './empleados-edit.component.html',
  imports:[NavbarComponent, FormsModule, CommonModule, RouterModule, MatIconModule],
  styleUrls: ['./empleados-edit.component.css']
})
export class EditEmpleadoComponent implements OnInit {

  ordenes: any[] = [];
  ordenesFiltradas: any[] = [];
  ordenesMensualesFiltradas: any[] = [];
  seccionActual: string = 'datosPersonales';
  empleado: any = {};
  categorias: any[] = [];
  ciudades: any[] = [];
  categoriaEmpleado: string = '';
  provinciaCórdobaId = 14;
  ciudadNombre: string = '';
  contadorCaracteres: number = 0;
  empleadoId: string | null = null;
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => 2024 + i);
  anioSeleccionado: number = new Date().getFullYear(); 
  mesSeleccionado: number = new Date().getMonth() + 1; 
  estadoSeleccionado: boolean = false;

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
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private ordenTrabajoService: OrdenTrabajoService  
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
    };
    this.categoriaEmpleadoService.getCategoriasEmpleados().subscribe({
      next: (data) => {
        console.log('Categorías obtenidas:', data);
        this.categorias = data;
      },
      error: (err) => {
        console.error('Error al obtener las categorías', err);
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

  cargarEmpleado(empleadoId: string) {
    this.http.get<any>(`http://localhost:3000/empleados/${empleadoId}`).subscribe({
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
          this.http.patch<any>(`http://localhost:3000/empleados/${empleadoId}`, empleadoActualizado).subscribe({
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
      const url = `https://apis.datos.gob.ar/georef/api/localidades?provincia=${this.provinciaCórdobaId}&nombre=${query}&max=10`;
      this.http.get<any>(url).subscribe({
        next: (response) => {
          this.ciudades = response.localidades.map((localidad: any) => ({
            id: localidad.id,
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
        console.log('Órdenes obtenidas:', this.ordenesFiltradas);
      },
      error: (err) => {
        console.error('Hubo un error al obtener las órdenes de trabajo', err);
        this.mostrarAlerta('Error', 'No se pudieron obtener las órdenes de trabajo.', 'error');
      }
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

    // Descargar el archivo PDF
    doc.save('cierre_mensual.pdf');
  }

  descargarExcel(): void {
    // Crear los encabezados para la tabla principal
    const columnas = ['Orden N°', 'Servicio', 'Horas Proyectadas', 'Horas Reales', 'A', 'LT', 'FC', 'FS', 'E'];

    // Crear las filas con los datos de las ordenes
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

    // Crear los totales como una fila adicional
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

    // Crear una hoja de trabajo con los datos (ordenes + totales)
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([columnas, ...filas, [], totales]);

    // Crear un libro de trabajo y agregar la hoja
    const wb: XLSX.WorkBook = { Sheets: { 'Resumen Mensual': ws }, SheetNames: ['Resumen Mensual'] };

    // Exportar el libro a un archivo Excel
    XLSX.writeFile(wb, 'cierre_mensual.xlsx');
  }
  
  truncateToTwoDecimals(value: number): string {
    return Math.floor(value * 100) / 100 + ''; // Trunca a 2 decimales
  }

}
