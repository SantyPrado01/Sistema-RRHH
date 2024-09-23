import { Component, OnInit } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { Empleado } from '../models/empleado.models';
import { EmpleadoService } from '../services/empleado.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-empleados-list',
  standalone: true,
  imports: [NabvarComponent, CommonModule, RouterModule],
  templateUrl: './empleados-list.component.html',
  styleUrl: './empleados-list.component.css'
})
export class EmpleadosListComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  searchTerm: string = '';
  filtroVisualizar: string = 'activo';  
  filtroOrdenar: string = 'nombre';     
  isModalOpen: boolean = false;

  constructor(private empleadoService: EmpleadoService, private route: ActivatedRoute, 
    private router: Router, private http: HttpClient ) {}

  ngOnInit(): void {
    this.obtenerEmpleados();
    this.empleadosFiltrados.forEach(empleado => {
      console.log('Empleado ID:', empleado.empleadoId);})
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
    this.empleadosFiltrados = this.empleados
      .filter(empleado => 
        !empleado.eliminado && 
        (empleado.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
         empleado.apellido.toLowerCase().includes(this.searchTerm.toLowerCase()))
      )
      .sort((a, b) => {
        if (this.filtroOrdenar === 'Nombre') {
          return a.nombre.localeCompare(b.nombre);
        } else if (this.filtroOrdenar === 'Apellido') {
          return a.apellido.localeCompare(b.apellido);
        } else if (this.filtroOrdenar === 'Categoria') {
          return a.categoria - b.categoria;
        }
        return 0;
      });
  }

  //Cambia el estado
  eliminarEmpleado(empleado: Empleado) {
    if (confirm('¿Estás seguro de que deseas marcar a este empleado como inactivo?')) {
      const empleadoId = empleado.empleadoId;

      this.http.patch<Empleado>(`http://localhost:3000/empleados/${empleadoId}`, {eliminado: true}).subscribe({
        next: (response) => {
          console.log('Empleado eliminado con éxito:', response);
          alert('Empleado eliminado con éxito');
          this.router.navigate(['/employee']);
        },
        error: (err) => {
          console.log('ID del empleado:', empleadoId);
          console.error('Error al eliminar el empleado:', err);
        }
      });
    } else{
      console.log('Operación cancelada');
    }
  }
}