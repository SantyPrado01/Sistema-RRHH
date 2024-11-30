import { CategoriaUsuario } from "./categoria.models";

export class Usuario{

    id: number
    username: string;
    categoria: CategoriaUsuario;

    constructor(id: number, username: string, categoria: CategoriaUsuario){
        this.id = id
        this.username = username;
        this.categoria = categoria;
    }

}
