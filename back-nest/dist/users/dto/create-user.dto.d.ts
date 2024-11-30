import { CategoriaUsuario } from "src/categoria-usuario/entities/categoria-usuario.entity";
export declare class CreateUserDto {
    username: string;
    password: string;
    categoria: CategoriaUsuario;
    eliminado: boolean;
    primerIngreso: boolean;
}
