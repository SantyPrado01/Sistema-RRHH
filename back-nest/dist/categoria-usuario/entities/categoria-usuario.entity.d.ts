import { User } from "src/users/user.entity";
export declare class CategoriaUsuario {
    id: number;
    nombre: string;
    eliminado: boolean;
    user: User[];
}
