import { User } from "../../users/user.entity";
export declare class RolUsuario {
    id: number;
    nombreRolUsuario: string;
    eliminado: boolean;
    usuarios: User[];
}
