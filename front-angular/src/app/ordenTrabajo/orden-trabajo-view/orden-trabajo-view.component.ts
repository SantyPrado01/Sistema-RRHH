import { Component, OnInit } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrdenTrabajoService } from '../services/orden-trabajo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Empleado } from '../../empleados/models/empleado.models';

@Component({
  selector: 'app-orden-trabajo-view',
  standalone: true,
  imports: [NabvarComponent, FormsModule, CommonModule],
  templateUrl: './orden-trabajo-view.component.html',
  styleUrl: './orden-trabajo-view.component.css'
})
export class OrdenTrabajoViewComponent implements OnInit{
  ordenId: string | null = null;
  ordenAsignada: any[] = [];
  horarios: any[] = []
  ordenIdNumeber: number = 0

  empresa: string = '';
  empleado: any = {};
  dias: string = '';
  horasProyectadas: number = 0;
  horasReales: number = 0;
  necesidad: any[]= []

  constructor(
    private ordenTrabajoService: OrdenTrabajoService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

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
        console.log('Orden Obtenida:', this.ordenAsignada)
        console.log('Horarios Asignados',this.horarios )
        console.log('Empleado', this.empleado)
      },
      error:(err) =>{
        console.error('Hubo un error al obtener las órdenes de trabajo', err)
      }
    })
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
