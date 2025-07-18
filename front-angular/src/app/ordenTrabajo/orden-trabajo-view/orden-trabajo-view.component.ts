import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../nabvar/navbar.component';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrdenTrabajoService } from '../services/orden-trabajo.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { HorarioAsignado } from '../../horariosAsignados/models/horariosAsignados.models';
import { HorariosAsignadosService } from '../../horariosAsignados/services/horariosAsignados.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../../Modales/mensajes-alerta/mensajes-alerta.component';
import { ConfirmacionDialogComponent } from '../../Modales/mensajes-confirmacion/mensajes-confirmacion.component';
import { EmpleadoService } from '../../empleados/services/empleado.service';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { Empleado } from '../../empleados/models/empleado.models';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { DialogObservacionesComponent } from '../../Modales/dialog-observaciones/dialog-observaciones.component';

@Component({
  selector: 'app-orden-trabajo-view',
  standalone: true,
  imports: [
    NavbarComponent,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatBadgeModule
  ],
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
  renovacionAutomatica: boolean = false;

  editModeOrden: boolean = false;

  selectedHorario: HorarioAsignado | null = null; 

  empleadoId: number = 0;
  empleadoNombre: string = '';
  empleadosFiltrados: any[] = [];
  empleadoControl = new FormControl('');
  
  constructor(
    private ordenTrabajoService: OrdenTrabajoService,
    private horarioService: HorariosAsignadosService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private empleadoService: EmpleadoService
  ){}

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
      this.dialog.open(AlertDialogComponent, {
        data: { title: titulo, message: mensaje, type: tipo },
      });
    }

  seleccionarEmpleado(empleado: any): void {
    console.log('Empleado seleccionado:', empleado.Id);
    this.empleadoId = empleado.Id;  
  }
  
  displayEmployeeName(empleado: Empleado): string {
    return empleado ? `${empleado.nombre} ${empleado.apellido}` : '';
  }

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
    this.ordenId = this.route.snapshot.paramMap.get('id') 
    if (this.ordenId){
      this.ordenIdNumeber = Number(this.ordenId)
      this.cargarOrden(this.ordenIdNumeber)
    }
  }

  cargarOrden(ordenId: number){
    this.ordenTrabajoService.getOrdenById(ordenId).subscribe({
      next:(data) => {
        console.log('Orden de trabajo:', data)
        this.ordenAsignada = data;
        this.horarios = data.horariosAsignados.map((horario: any) => ({
          ...horario,
          empleadoSuplenteControl: new FormControl(horario.empleadoSuplente || null),
        }));
        this.empresa = data.servicio.nombre
        this.empleado = data.empleadoAsignado
        this.horasProyectadas = data.horasProyectadas
        this.horasReales = data.horasReales
        this.necesidad = data.necesidadHoraria
        this.mes = data.mes
        this.renovacionAutomatica = data.renovacionAutomatica;

        this.empleadoNombre = `${this.empleado.apellido}, ${this.empleado.nombre}`;
        this.dias = this.obtenerDias(this.necesidad);

        this.empleadoId = this.empleado.Id; // Asignar el ID del empleado al cargar la orden
        // Configurar autocomplete para cada horario
        this.horarios.forEach(horario => {
          this.setupEmpleadoSuplenteAutocomplete(horario);
        });
      },
      error:(err) =>{
        console.error('Hubo un error al obtener las órdenes de trabajo', err)
      }
    })
  }

  setupEmpleadoSuplenteAutocomplete(horario: any): void {
    horario.empleadoSuplenteControl.valueChanges
      .pipe(
        debounceTime(300),
        filter((value: any) => typeof value === 'string'),
        switchMap((value: string) => this.empleadoService.buscarEmpleados(value || ''))
      )
      .subscribe((empleados: any[]) => {
        horario.empleadosFiltrados = empleados;
      });
  }

  seleccionarEmpleadoSuplente(horario: any, empleado: any): void {

    if(empleado){
      horario.empleadoSuplente = empleado;
      horario.suplente = true;
    }
    else {
      horario.empleadoSuplente = null;
      horario.suplente = false;
    }
    horario.empleadoSuplenteControl.setValue(empleado, { emitEvent: false });
    console.log('Horario actualizado:', horario); // Para debug
  }

  toggleEditMode(horario: any): void {
    horario.editMode = !horario.editMode;
  }

  activarEdicion(): void {
    this.editModeOrden = true;
  }

  cancelarEdicion(): void {
    this.editModeOrden = false;
    this.cargarOrden(this.ordenIdNumeber); // Opcional: recarga para descartar cambios
  }

  editarOrdenTrabajo(): void {
  const dialogRef = this.dialog.open(ConfirmacionDialogComponent, {
    data: { 
      title: 'Confirmar Edición', 
      message: '¿Estás seguro de que deseas editar el empleado y la renovación de esta orden de trabajo?', 
      type: 'confirm' 
    }
  });

  dialogRef.afterClosed().subscribe((result) => {
    if (result) {
      this.ordenTrabajoService.editarOrdenTrabajo(
        this.ordenIdNumeber.toString(), 
        this.empleadoId, // asegúrate de que esto sea un número
        this.renovacionAutomatica // booleano que estás usando en el formulario
      ).subscribe({
        next: (response) => {
          console.log('✅ Respuesta del backend:', response);
          this.mostrarAlerta('Operación Exitosa', 'Orden de trabajo actualizada exitosamente.', 'success');
          this.editModeOrden = false;
          this.cargarOrden(this.ordenIdNumeber); // Recargar datos actualizados
        },
        error: (err) => {
          console.error('❌ Error al actualizar la orden:', err);
          this.mostrarAlerta('Error', 'No se pudo actualizar la orden de trabajo.', 'error');
        }
      });
    }
  });
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
        console.log('Horario a actualizar:', horario); // Para debug
        console.log('Empleado suplente:', horario.empleadoSuplente);
        console.log('Empleado suplente control:', horario.empleadoSuplenteControl); // Para debug

       const empleadoSuplenteDef = horario.empleadoSuplenteControl.value || null;
        
        const updatedHorario = {
          horaInicioReal: horario.horaInicioReal,
          horaFinReal: horario.horaFinReal,
          estado: horario.estado,
          comprobado: true,
          observaciones: horario.observaciones,
          empleadoSuplente: empleadoSuplenteDef,
          suplente: Boolean(horario.empleadoSuplente),
          estadoSuplente: horario.empleadoSuplente ? horario.estadoSuplente || 'Asistió' : null
        };
        
        console.log('Datos a enviar:', updatedHorario); // Para debug
  
        this.horarioService.editHorario(horario.horarioAsignadoId, updatedHorario).subscribe({
          next: (response) => {
            console.log('Respuesta del backend:', response); 
            this.mostrarAlerta('Operación Exitosa', 'Horarios Actualizados con éxito.', 'success');
            horario.editMode = false;
            // Recargar los datos después de guardar
            this.cargarOrden(this.ordenIdNumeber);
          },
          error: (err) => {
            console.error('Error al guardar:', err); // Para debug
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

  eliminarHorario(id: number): void {
    this.horarioService.deleteHorario(id).subscribe({
      next: () => {
        this.mostrarAlerta('Operación Exitosa', 'Horario eliminado con éxito.', 'success');
        this.cargarOrden(this.ordenIdNumeber);
      },
    });
  }

  abrirDialogoObservaciones(observacion: string, horarioAsignadoId:number): void {
      if (!observacion) return;
    
      this.dialog.open(DialogObservacionesComponent, {
        data: { observacion, idHorario: horarioAsignadoId },
      });

      this.dialog.afterAllClosed.subscribe(() => {
        // Recargar la orden para reflejar los cambios en las observaciones
        this.cargarOrden(this.ordenIdNumeber);
      });
    }
}