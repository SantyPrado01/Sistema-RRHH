import { Component } from '@angular/core';
import { ServicioService } from '../../servicios/services/servicio.service';
import { EmpleadoService } from '../../empleados/services/empleado.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Empleado } from '../../empleados/models/empleado.models';
import { Empresa } from '../../servicios/models/servicio.models';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { BuscarEmpresaComponent } from '../../Modales/buscar-empresa/buscar-empresa.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-crear-orden-trabajo',
  standalone: true,
  imports: [CommonModule, FormsModule, NabvarComponent, MatDialogModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  templateUrl: './crear-orden-trabajo.component.html',
  styleUrl: './crear-orden-trabajo.component.css'
})
export class CrearOrdenTrabajoComponent {

  seccionActual: string = 'ordenTrabajo';
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  anios: number[] = Array.from({ length: 11 }, (_, i) => 2024 + i); 
  empresas: any[] = [];

  necesidad = [
    { diaSemana: 1, nombre: 'Lunes', horaInicio: '', horaFin: '' },
    { diaSemana: 2, nombre: 'Martes', horaInicio: '', horaFin: '' },
    { diaSemana: 3, nombre: 'Miércoles', horaInicio: '', horaFin: '' },
    { diaSemana: 4, nombre: 'Jueves', horaInicio: '', horaFin: '' },
    { diaSemana: 5, nombre: 'Viernes', horaInicio: '', horaFin: '' },
    { diaSemana: 6, nombre: 'Sábado', horaInicio: '', horaFin: '' },
    { diaSemana: 7, nombre: 'Domingo', horaInicio: '', horaFin: '' }
  ];

  constructor(private dialog: MatDialog) {
    
  }

  mostrarSeccion(seccion: string): void {
    this.seccionActual = seccion;
  }
  abrirModal() {
    const dialogRef = this.dialog.open(BuscarEmpresaComponent, {
      data: { empresas: this.empresas },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const inputEmpresa = <HTMLInputElement>document.getElementById('empresa');
        inputEmpresa.value = result.nombre; // Asigna el nombre al input
      }
    });
  }

}
