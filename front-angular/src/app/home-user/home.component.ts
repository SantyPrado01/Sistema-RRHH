import { Component } from '@angular/core';
import { NavbarComponent } from '../nabvar/navbar.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../login/auth/auth.service';
import { OrdenTrabajoService } from '../ordenTrabajo/services/orden-trabajo.service';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, CommonModule, RouterModule, FormsModule, MatIconModule],
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
    this.ordenTrabajoService.getAll()

  }
  ordenes: any[] = [];
  anioActual: number = new Date().getFullYear();
  completado: boolean = false
  horasProyectadas: string = ''
  horasReales: string = ''
  meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  mesActual: string = this.meses[new Date().getMonth()];

  obtenerOrdenes() {
    const mesNumero = new Date().getMonth() + 1;
    this.ordenTrabajoService.getOrdenesPorMesAnio(mesNumero, this.anioActual).subscribe(
      (data) => {
        this.ordenes = data;
        console.log(this.ordenes)
      },
      (error) => {
        console.error('Hubo un error al obtener las órdenes de trabajo', error);
      }
    );
  }

  obtenerHoras() {
    const mesNumero = new Date().getMonth() + 1;
    this.ordenTrabajoService.getHorasPorMes(mesNumero, this.anioActual).subscribe((data) => {
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

  truncateToTwoDecimals(value: number): string {
    return Math.floor(value * 100) / 100 + ''; 
  }
}
