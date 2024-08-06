import { CreateRolUsuarioDto } from './create-rol-usuario.dto';
declare const UpdateRolUsuarioDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateRolUsuarioDto>>;
export declare class UpdateRolUsuarioDto extends UpdateRolUsuarioDto_base {
    nombre?: string;
}
export {};
