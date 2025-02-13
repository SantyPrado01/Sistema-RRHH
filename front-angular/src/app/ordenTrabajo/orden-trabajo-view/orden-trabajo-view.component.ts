import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrdenTrabajoService } from '../services/orden-trabajo.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import * as XLSX from 'xlsx';
import { HorarioAsignado } from '../../horariosAsignados/models/horariosAsignados.models';
import { HorariosAsignadosService } from '../../horariosAsignados/services/horariosAsignados.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';


@Component({
  selector: 'app-orden-trabajo-view',
  standalone: true,
  imports: [NavbarComponent, FormsModule, CommonModule, MatIconModule, RouterModule],
  templateUrl: './orden-trabajo-view.component.html',
  styleUrl: './orden-trabajo-view.component.css'
})
export class OrdenTrabajoViewComponent implements OnInit{
  ordenId: string | null = null;
  ordenAsignada: any[] = [];
  horarios: any[] = []
  ordenIdNumeber: number = 0
  mes: string = '';

  empresa: string = '';
  empleado: any = {};
  dias: string = '';
  horasProyectadas: number = 0;
  horasReales: number = 0;
  necesidad: any[]= []

  selectedHorario: HorarioAsignado | null = null; 

  empleadoNombre: string = '';

  constructor(
    private ordenTrabajoService: OrdenTrabajoService,
    private horarioService: HorariosAsignadosService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog
    
  ){}

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
      this.dialog.open(AlertDialogComponent, {
        data: { title: titulo, message: mensaje, type: tipo },
      });
    }

  ngOnInit(): void {
    this.ordenId = this.route.snapshot.paramMap.get('id') 
    if (this.ordenId){
      this.ordenIdNumeber = Number(this.ordenId)
      this.cargarOrden(this.ordenIdNumeber)
    }
  }

  cargarOrden(ordenId: number){
    this.ordenTrabajoService.getOrdenById(ordenId).subscribe({
      next:(data) => {
        this.ordenAsignada = data;
        this.horarios = data.horariosAsignados
        this.empresa = data.servicio.nombre
        this.empleado = data.empleadoAsignado
        this.horasProyectadas = data.horasProyectadas
        this.horasReales = data.horasReales
        this.necesidad = data.necesidadHoraria
        this.mes = data.mes

        this.empleadoNombre = `${this.empleado.apellido}, ${this.empleado.nombre}`;
        this.dias = this.obtenerDias(this.necesidad);
        console.log('Orden Obtenida:', this.ordenAsignada)
        console.log('Horarios Asignados',this.horarios )
        console.log('Empleado', this.empleado)
      },
      error:(err) =>{
        console.error('Hubo un error al obtener las órdenes de trabajo', err)
      }
    })
  }

  toggleEditMode(horario: any): void {
    horario.editMode = !horario.editMode;
  }

  saveChanges(horario: any): void {
    const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
      data: { 
        title: 'Confirmar Edición', 
        message: 'Esto modificará las horas reales. ¿Estás seguro de que deseas guardar los cambios?', 
        type: 'confirm' 
      }
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedHorario = {
          horaInicioReal: horario.horaInicioReal,
          horaFinReal: horario.horaFinReal,
          estado: horario.estado,
          observaciones: horario.observaciones,
        };
  
        this.horarioService.editHorario(horario.horarioAsignadoId, updatedHorario).subscribe({
          next: (response) => {
            console.log('Respuesta del backend:', response); 
            this.mostrarAlerta('Operación Exitosa', 'Horarios Actualizados con éxito.', 'success');
            horario.editMode = false;
          },
          error: (err) => {
            this.mostrarAlerta('Error Operación', 'Error al guardar el horario.', 'error');
          }
        });
      }
    });
  }
  

  cancelEdit(horario: any): void {
    horario.editMode = false;
  }

  obtenerDias(necesidades: any[]): string {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'];
    const diasConHorario = necesidades
      .filter(n => n.horaInicio !== "00:00:00" && n.horaFin !== "00:00:00")
      .map(n => diasSemana[parseInt(n.diaSemana, 10) - 1]) 
      .filter((dia, index, self) => dia && self.indexOf(dia) === index);
    return diasConHorario.join(', ') || 'No hay días con horarios definidos';
  }

  descargarPdf() {
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text('Listado de Horarios', 20, 20);
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
  
    doc.text(`Empresa: ${this.empresa}`, 20, 30);
    doc.text(`Empleado: ${this.empleadoNombre}`, 120, 30); 
  
    doc.text(`Horas Proyectadas: ${this.horasProyectadas}`, 20, 40);
    doc.text(`Horas Reales: ${this.horasReales}`, 120, 40); 
  
    const columns = ['Fecha', 'Hora Inicio', 'Hora Fin', 'Horario Inicio Real', 'Horario Fin Real', 'Estado'];
    const rows = this.horarios.map(horario => [
      new Date(horario.fecha).toLocaleDateString(),
      horario.horaInicioProyectado,
      horario.horaFinProyectado,
      horario.horaInicioReal,
      horario.horaFinReal,
      horario.estado
    ]);
  
    (doc as any).autoTable({
      head: [columns],
      body: rows,
      startY: 50, 
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

    doc.save('listado_horarios.pdf');
  }
  
  

  descargarExcel() {
    const columns = ['Fecha', 'Hora Inicio', 'Hora Fin', 'Horario Inicio Real', 'Horario Fin Real', 'Estado'];
    const data = this.horarios.map(horario => [
      new Date(horario.fecha).toLocaleDateString(),
      horario.horaInicioProyectado,
      horario.horaFinProyectado,
      horario.horaInicioReal,
      horario.horaFinReal,
      horario.estado
    ]);
  
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);
  
    const info = [
      ['Empresa:', this.empresa],
      ['Empleado:', this.empleadoNombre],
      ['Horas Proyectadas:', this.horasProyectadas],
      ['Horas Reales:', this.horasReales]
    ];
  
    XLSX.utils.sheet_add_aoa(ws, info, { origin: 'A1' });
    XLSX.utils.sheet_add_aoa(ws, [columns], { origin: `A${info.length + 2}` }); 
    XLSX.utils.sheet_add_aoa(ws, data, { origin: `A${info.length + 3}` });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Listado de Horarios');
  
    XLSX.writeFile(wb, 'listado_horarios.xlsx');
  }

}
