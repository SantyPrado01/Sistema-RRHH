import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/ususario.models';
import { NabvarComponent } from '../../../nabvar/nabvar.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BuscarEmpleadoComponent } from '../../../Modales/buscar-empleado/buscar-empleado.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Empleado } from '../../../empleados/models/empleado.models';

@Component({
  selector: 'app-usuario-new',
  standalone: true,
  imports: [FormsModule, NabvarComponent, CommonModule, MatIconModule],
  templateUrl: './usuario-new.component.html',
  styleUrls: ['./usuario-new.component.css']
})
export class UsuarioNewComponent implements OnInit {

  seccionActual: string = 'datosUsuario';
  empleado: Empleado[] = [];
  usuario: any = {};

  constructor(private dialog: MatDialog, private router: Router) {}

  ngOnInit(): void {
    // Inicialización si es necesario
  }

  mostrarSeccion(seccion: string): void {
    this.seccionActual = seccion;
  }

  abrirModalEmpleado() {
    const dialogRef = this.dialog.open(BuscarEmpleadoComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empleado = result.nombre;
      }
    });
  }



}
