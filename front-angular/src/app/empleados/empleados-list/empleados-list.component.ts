import { Component, OnInit } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { Empleado } from '../models/empleado.models';
import { EmpleadoService } from '../services/empleado.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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

  constructor(private empleadoService: EmpleadoService) {}

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
    this.empleadosFiltrados = this.empleados
      .filter(empleado => 
        (this.filtroVisualizar === 'activo' ? !empleado.eliminado : empleado.eliminado) &&
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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.obtenerEmpleados();  // Refrescar la lista después de agregar un empleado
  }

  editarEmpleado(empleado: Empleado) {
    // Lógica para editar empleado
  }

  eliminarEmpleado(empleado: Empleado) {
    if (confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      this.empleadoService.deleteEmpleado(empleado.id).subscribe(() => {
        this.obtenerEmpleados();
      });
    }
  }
}