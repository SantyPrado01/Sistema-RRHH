export class Empleado {
    legajo: number;
    nombre: string;
    apellido: string;
    nroDocumento: number;
    telefono: number;
    email: string;
    fechaIngreso?: Date;
    eliminado: boolean;
    categoriasID: number;
    disponibilidadID: number;
    ciudadID: number;
  
    constructor(
      legajo: number,
      nombre: string,
      apellido: string,
      nroDocumento: number,
      telefono: number,
      email: string,
      eliminado: boolean,
      categoriasID: number,
      disponibilidadID: number,
      ciudadID: number,
      fechaIngreso?: Date
    ) {
      this.legajo = legajo;
      this.nombre = nombre;
      this.apellido = apellido;
      this.nroDocumento = nroDocumento;
      this.telefono = telefono;
      this.email = email;
      this.fechaIngreso = fechaIngreso;
      this.eliminado = eliminado;
      this.categoriasID = categoriasID;
      this.disponibilidadID = disponibilidadID;
      this.ciudadID = ciudadID;
    }
  }