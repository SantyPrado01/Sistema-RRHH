export class Categoria{

    id: number
    nombre: string;
    eliminado: boolean;

    constructor(id: number, nombre: string, eliminado: boolean){
        this.id = id
        this.nombre = nombre;
        this.eliminado = eliminado;
    }

}
