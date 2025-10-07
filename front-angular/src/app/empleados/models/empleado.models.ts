import { CategoriaEmpleado } from "./categoria.models";
import { Disponibilidad } from "./disponibilidad.models";

export interface DisponibilidadHoraria {
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  nombre?: string;
}

export class Empleado {
    Id: number;
    legajo: number;
    nombre: string;
    apellido: string;
    nroDocumento: number;
    telefono: number;
    email: string;
    fechaIngreso?: string | Date;
    eliminado: boolean;
    ciudad?: number;
    observaciones: string;
    categoria: number;
    disponibilidadID: number;
    disponibilidades?: Disponibilidad[];
    fulltime?: boolean;
    horasCategoria?: number;
  
    constructor(
      Id: number,
      legajo: number,
      nombre: string,
      apellido: string,
      nroDocumento: number,
      telefono: number,
      email: string,
      eliminado: boolean,
      categoria: number,
      observaciones: string,
      disponibilidadID: number,
      ciudad?: number,
      fechaIngreso?: string | Date,
      disponibilidades?: Disponibilidad[],
      fulltime?: boolean,
      horasCategoria?: number
    ) {
      this.Id = Id;
      this.legajo = legajo;
      this.nombre = nombre;
      this.apellido = apellido;
      this.nroDocumento = nroDocumento;
      this.telefono = telefono;
      this.email = email;
      this.fechaIngreso = fechaIngreso;
      this.eliminado = eliminado;
      this.categoria = categoria;
      this.observaciones = observaciones;
      this.disponibilidadID = disponibilidadID;
      this.ciudad = ciudad;
      this.disponibilidades = disponibilidades;
      this.fulltime = fulltime;
      this.horasCategoria = horasCategoria;
    }
}