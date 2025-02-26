import { Component } from '@angular/core';
import { NavbarComponent } from '../nabvar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OrdenTrabajoService } from '../ordenTrabajo/services/orden-trabajo.service';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule, FormsModule, MatIconModule],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.css'
})
export class InformesComponent {

  ordenes: any[] = [];
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

  reportes:{ nombre: string, funcion: ()=> void }[] = [
    {nombre:'Reporte de horas por Empleado por Empresa', funcion: this.obtenerOrdenesMesAnio.bind(this)},
  ];

  constructor(
    private ordenTrabajoService: OrdenTrabajoService,
    ) {}

  ngOnInit(): void {}

  obtenerOrdenesMesAnio() {
    const mesNumero = this.convertirMesANumero(this.mesSeleccionado);
    this.ordenTrabajoService.getOrdenesPorMesAnio(mesNumero, this.anioSeleccionado).subscribe(
      (data) => {
        this.ordenes = data.ordenes;
        this.horasProyectadas = data.horasProyectadasTotales;
        this.horasReales = data.horasRealesTotales;
        this.necesidad = data.necesidadHoraria
        console.log('Horas', this.horasProyectadas);
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
    const reporteSeleccionado = this.reportes.find(reporte => reporte.nombre === this.reporteSeleccionado);
    if (reporteSeleccionado) {
      reporteSeleccionado.funcion();
    }
  }

  descargarPdf(): void {
      const doc = new jsPDF();
  
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text('Reporte Empresa por Empleado', 20, 20);
  
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text(`Horas Proyectadas: ${(this.horasProyectadas)}`, 20, 40);
      doc.text(`Horas Reales: ${(this.horasReales)}`, 120, 40);
  
      const columns = ['Empresa','Apellido','Nombre', 'Dias', 'Horas Proyectadas', 'Horas Reales'];
      const rows = this.ordenes.map(orden => [
        orden.servicio.nombre,
        orden.empleadoAsignado.apellido,
        orden.empleadoAsignado.nombre,
        this.obtenerDias(orden.necesidadHoraria),
        orden.horasProyectadas,
        orden.horasReales,
      ]);
  
      (doc as any).autoTable({
        head: [columns],
        body: rows,
        startY: 60, 
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
  
      doc.save('reporte.pdf');
    }
  
    descargarExcel(): void {
    
      const columnas = ['Empresa', 'Apellido', 'Nombre', 'Dias', 'Horas Proyectadas', 'Horas Reales'];
  
      const filas = this.ordenes.map(orden => [
        orden.servicio.nombre,
        orden.empleadoAsignado.apellido,
        orden.empleadoAsignado.nombre,
        this.obtenerDias(orden.necesidadHoraria),
        orden.horasProyectadas,
        orden.horasReales,
      ]);
      
      const resumen = [
        ['Horas Proyectadas', this.horasProyectadas],
        ['Horas Reales', this.horasReales]
      ];
  
      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([...resumen, [], columnas, ...filas]);
  
      const wb: XLSX.WorkBook = { Sheets: { 'Reporte Mensual': ws }, SheetNames: ['Reporte Mensual'] };
  
      XLSX.writeFile(wb, 'reporte.xlsx');
    }
    
    truncateToTwoDecimals(value: number): string {
      return Math.floor(value * 100) / 100 + ''; 
    }
}
