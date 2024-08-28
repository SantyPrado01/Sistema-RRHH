import { RolUsuario } from "../rol-usuario/entities/rol-usuario.entity";
export declare class User {
    id: number;
    username: string;
    password: string;
    eliminado: boolean;
    rol: RolUsuario;
}
