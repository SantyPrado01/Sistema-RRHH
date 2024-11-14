export class Empleado {
    Id: number;
    legajo: number;
    nombre: string;
    apellido: string;
    nroDocumento: number;
    telefono: number;
    email: string;
    fechaIngreso?: Date;
    eliminado: boolean;
    ciudad:number;
    observaciones:string;
    categoria: number;
    disponibilidadID: number;
  
    constructor(
      Id: number,
      legajo: number,
      nombre: string,
      apellido: string,
      nroDocumento: number,
      telefono: number,
      email: string,
      eliminado: boolean,
      ciudad: number,
      categoria: number,
      observaciones: string,
      disponibilidadID: number,
      fechaIngreso?: Date,
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
      this.observaciones = observaciones
      this.disponibilidadID = disponibilidadID;
      this.ciudad = ciudad;
    
    }
  }