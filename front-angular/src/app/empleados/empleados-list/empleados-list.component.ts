import { Component, OnInit } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { Empleado } from '../models/empleado.models';
import { EmpleadoService } from '../services/empleado.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [NabvarComponent, CommonModule, RouterModule, MatIconModule, FormsModule],
  templateUrl: './empleados-list.component.html',
  styleUrl: './empleados-list.component.css'
})
export class EmpleadosListComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  searchTerm: string = '';
  filtroVisualizar: string = 'activo'; 
  filtroOrdenar: string = 'nombre';     


  constructor(private empleadoService: EmpleadoService, private route: ActivatedRoute, 
    private router: Router, private http: HttpClient ) {}

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  obtenerEmpleados() {
    this.empleadoService.getEmpleados().subscribe((data: Empleado[]) => {
      this.empleados = data;
      this.filtrarEmpleados();
    });
  }

  buscarEmpleado() {
    this.filtrarEmpleados();
  }

  filtrarEmpleados() {
    this.empleadosFiltrados = this.empleados.filter(empleado => {
      const coincideEstado = this.filtroVisualizar === 'activo' ? !empleado.eliminado : empleado.eliminado;
      if(!coincideEstado) return false;
      const coincideNombreApellido = empleado.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                     empleado.apellido.toLowerCase().includes(this.searchTerm.toLowerCase());
      return coincideEstado && coincideNombreApellido;
    });

    if (this.filtroOrdenar === 'nombre'){
      this.empleadosFiltrados.sort((a,b) => a.nombre.localeCompare(b.nombre));
    } else if (this.filtroOrdenar === 'apellido'){
      this.empleadosFiltrados.sort((a,b) => a.apellido.localeCompare(b.apellido))
    }
  }

  eliminarEmpleado(empleado: Empleado) {
    if (confirm('¿Estás seguro de que deseas marcar a este empleado como inactivo?')) {
      const empleadoId = empleado.Id;
      console.log('Empleado ID:', empleado.Id);
      this.http.patch<Empleado>(`http://localhost:3000/empleados/${empleadoId}`, { eliminado: true }).subscribe({
        next: (response) => {
          console.log('Empleado eliminado con éxito:', response);
          alert('Empleado eliminado con éxito');
          this.obtenerEmpleados();  // Recargar los empleados después de la eliminación
        },
        error: (err) => {
          console.log('ID del empleado:', empleadoId);
          console.error('Error al eliminar el empleado:', err);
        }
      });
    } else {
      console.log('Operación cancelada');
    }
  }
}
