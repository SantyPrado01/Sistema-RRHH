import { Component, OnInit } from '@angular/core';
import { HorarioAsignado } from './models/horariosAsignados.models';
import { HorariosAsignadosService } from './services/horariosAsignados.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NabvarComponent } from '../nabvar/nabvar.component';

@Component({
  selector: 'app-horarios-asignados',
  standalone: true,
  imports: [CommonModule, FormsModule, NabvarComponent],
  templateUrl: './horarios-asignados.component.html',
  styleUrls: ['./horarios-asignados.component.css'] // Asegúrate de que esto sea "styleUrls"
})
export class HorariosAsignadosComponent implements OnInit {
  
  horariosAsignados: HorarioAsignado[] = [];
  selectedHorario: HorarioAsignado | null = null; // Cambiar a null
  horaInicioReal: string = '';
  horaFinReal: string = '';
  estado: string = ''; 

  selectHorario(horario: HorarioAsignado): void {
    this.selectedHorario = horario;
    this.horaInicioReal = '';
    this.horaFinReal = '';
    this.estado = ''; 
  }
  
  constructor(private horarioService: HorariosAsignadosService) {}
  
  ngOnInit(): void {
    this.fetchHorarios();
  }
  
  fetchHorarios(): void {
    this.horarioService.getHorariosAsignados().subscribe(data => {
      this.horariosAsignados = data;
    });
  }
}
