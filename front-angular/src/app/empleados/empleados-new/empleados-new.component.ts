import { Component } from '@angular/core';
import { NabvarComponent } from '../../nabvar/nabvar.component';
import { Empleado } from '../models/empleado.models';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empleados-new',
  standalone: true,
  imports: [NabvarComponent, FormsModule, CommonModule],
  templateUrl: './empleados-new.component.html',
  styleUrl: './empleados-new.component.css'
})
export class EmpleadosNewComponent {

  empleado: Empleado = {
    legajo: 0, // Valor numérico por defecto
    nombre: '',
    apellido: '',
    nroDocumento: 0, // Puede ser un string o number según lo requieras
    telefono: 0, // Valor numérico por defecto
    email: '',
    fechaIngreso: undefined, // Puede ser Date o undefined si es opcional
    eliminado: false, // Valor booleano por defecto
    categoriasID: 0, // Valor numérico por defecto
    disponibilidadID: 0, // Valor numérico por defecto
    ciudadID: 0 // Valor numérico por defecto
  };
  
  categorias = [
    { id: 1, nombre: 'Administración' },
    { id: 2, nombre: 'Ventas' },
    { id: 3, nombre: 'Soporte Técnico' }
  ];
  
  guardarEmpleado() {
    // Lógica para guardar el empleado
  }
  
  cancelar() {
    // Lógica para cancelar el registro
  }

}
