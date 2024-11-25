import { CategoriaUsuario } from "src/categoria-usuario/entities/categoria-usuario.entity";
export declare class User {
    id: number;
    username: string;
    password: string;
    categoria: CategoriaUsuario[];
    eliminado: boolean;
    primerIngreso: boolean;
}
