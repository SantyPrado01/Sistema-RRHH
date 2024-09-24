export class Empresa {
    servicioId: number;
    nombre: string;
    cuit: string;
    direccion: string;
    telefono: number;
    categoria: number;
    email: string;
    eliminado: boolean;
    ciudad: number;
    observaciones: string;

    constructor(
        servicioId: number,
        nombre: string,
        cuit: string,
        direccion: string,
        telefono: number,
        categoria: number,
        email: string,
        eliminado: boolean,
        ciudad: number,
        observaciones: string
    ) {
        this.servicioId = servicioId;
        this.nombre = nombre;
        this.cuit = cuit;
        this.direccion = direccion;
        this.telefono = telefono;
        this.categoria = categoria;
        this.email = email;
        this.eliminado = eliminado;
        this.ciudad = ciudad;
        this.observaciones = observaciones;
    }
}
