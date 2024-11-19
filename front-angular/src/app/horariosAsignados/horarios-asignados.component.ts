import { Component, OnInit } from '@angular/core';
import { HorarioAsignado } from './models/horariosAsignados.models';
import { HorariosAsignadosService } from './services/horariosAsignados.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NabvarComponent } from '../nabvar/nabvar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AlertDialogComponent } from '../Modales/mensajes-alerta/mensajes-alerta.component';


@Component({
  selector: 'app-horarios-asignados',
  standalone: true,
  imports: [CommonModule, FormsModule, NabvarComponent, MatDialogModule],
  templateUrl: './horarios-asignados.component.html',
  styleUrls: ['./horarios-asignados.component.css'] 
})
export class HorariosAsignadosComponent implements OnInit {
  
  horariosAsignados: HorarioAsignado[] = [];
  selectedHorario: HorarioAsignado | null = null; 
  horaInicioReal: string = '';
  horaFinReal: string = '';
  estado: string = ''; 
  observaciones: string = '';
  comprobado: boolean = true; 

  selectHorario(horario: HorarioAsignado): void {
    this.selectedHorario = horario;
    this.horaInicioReal = '';
    this.horaFinReal = '';
    this.estado = '';
    this.observaciones = ''; 
    this.comprobado = true;
  }
  
  constructor(private horarioService: HorariosAsignadosService, private dialog: MatDialog) {}
  
  ngOnInit(): void {
    this.fetchHorarios();
  }

  mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error'): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title: titulo, message: mensaje, type: tipo },
    });
  }
  
  fetchHorarios(): void {
    this.horarioService.getHorariosAsignados().subscribe(data => {
      this.horariosAsignados = data;
    });
  }

  actualizarHorarios(){
    if (!this.selectedHorario) return;

    const updatedHorario: HorarioAsignado = {
      ...this.selectedHorario,
      horaInicioReal: this.horaInicioReal,
      horaFinReal: this.horaFinReal,
      estado: this.estado,
      observaciones: this.observaciones,
      comprobado: this.comprobado
    };
    console.log('Datos enviados para actualización:', updatedHorario.comprobado);

    this.horarioService.updateHorario(updatedHorario).subscribe({
      next: (response) => {
        console.log('Horario actualizado:', response);
        this.mostrarAlerta('Actualización Exitosa', 'El horario ha sido actualizado exitosamente.', 'success');
        this.cancelarEdicion()
      },
      error: (error) => {
        console.error('Error al actualizar el horario:', error);
        alert('Hubo un error al actualizar el horario. Inténtelo de nuevo.');
      }
    });
    this.ngOnInit()
  }

  cancelarEdicion() {
    this.selectedHorario = null;
    this.horaInicioReal = '';
    this.horaFinReal = '';
    this.estado = '';
    this.observaciones = '';
  }

}
