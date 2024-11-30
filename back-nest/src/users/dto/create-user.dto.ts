import { CategoriaUsuario } from "src/categoria-usuario/entities/categoria-usuario.entity";


export class CreateUserDto {

    username: string;
    password: string;
    categoria: CategoriaUsuario;
    eliminado:boolean;
    primerIngreso: boolean;

}