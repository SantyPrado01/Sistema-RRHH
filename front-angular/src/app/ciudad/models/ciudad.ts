export class Ciudad {
    idCiudad: number;
    nombreCiudad: string;
    eliminado: boolean;
  
    constructor(idCiudad: number, nombreCiudad: string, eliminado: boolean = false) {
      this.idCiudad = idCiudad;
      this.nombreCiudad = nombreCiudad;
      this.eliminado = eliminado;
    }
  }
  