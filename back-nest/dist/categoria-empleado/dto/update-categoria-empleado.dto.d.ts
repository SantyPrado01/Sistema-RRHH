import { CreateCategoriaEmpleadoDto } from './create-categoria-empleado.dto';
declare const UpdateCategoriaEmpleadoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCategoriaEmpleadoDto>>;
export declare class UpdateCategoriaEmpleadoDto extends UpdateCategoriaEmpleadoDto_base {
    nombre?: string;
}
export {};
