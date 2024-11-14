import { Component } from '@angular/core';
import { NabvarComponent } from '../nabvar/nabvar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../login/auth/auth.service';
import { OrdenTrabajoService } from '../ordenTrabajo/services/orden-trabajo.service';
import { OrdenTrabajo } from '../ordenTrabajo/models/orden-trabajo.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NabvarComponent, CommonModule, RouterModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  username: string | null = '';

  constructor(private authService: AuthService, private ordenTrabajoService: OrdenTrabajoService) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
    this.obtenerOrdenes();
    this.obtenerHoras();
  }

  ordenes: any[] = [];
  mesActual: number = new Date().getMonth() + 1;
  anioActual: number = new Date().getFullYear();
  completado: boolean = false
  horasProyectadas: number = 0
  horasReales: number = 0

  obtenerOrdenes() {
    this.ordenTrabajoService.getOrdenesPorMesAnio(this.mesActual, this.anioActual, this.completado).subscribe(
      (data) => {
        this.ordenes = data; // Guardamos las órdenes en la variable `ordenes`
        console.log(this.ordenes)
      },
      (error) => {
        console.error('Hubo un error al obtener las órdenes de trabajo', error);
      }
    );
  }

  obtenerHoras() {
    this.ordenTrabajoService.getHorasPorMes(this.mesActual, this.anioActual, this.completado).subscribe((data) => {
      console.log('Horarios', data)
      if (data) {
        this.horasProyectadas = data.horasProyectadas;
        this.horasReales = data.horasReales;
      }
    });
  }

  obtenerDias(necesidades: any[]): string {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado','Domingo'];
    const diasConHorario = necesidades
      .filter(n => n.horaInicio !== "00:00:00" && n.horaFin !== "00:00:00")
      .map(n => diasSemana[parseInt(n.diaSemana, 10) - 1]) 
      .filter((dia, index, self) => dia && self.indexOf(dia) === index);
    return diasConHorario.join(', ') || 'No hay días con horarios definidos';
  }
  

}
