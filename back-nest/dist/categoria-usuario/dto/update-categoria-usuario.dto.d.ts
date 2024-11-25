import { CreateCategoriaUsuarioDto } from './create-categoria-usuario.dto';
declare const UpdateCategoriaUsuarioDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCategoriaUsuarioDto>>;
export declare class UpdateCategoriaUsuarioDto extends UpdateCategoriaUsuarioDto_base {
    nombre?: string;
    eliminado?: boolean;
}
export {};
