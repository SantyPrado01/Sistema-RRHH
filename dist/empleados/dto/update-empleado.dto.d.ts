import { CreateEmpleadoDto } from './create-empleado.dto';
declare const UpdateEmpleadoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateEmpleadoDto>>;
export declare class UpdateEmpleadoDto extends UpdateEmpleadoDto_base {
    nombre?: string;
    apellido?: string;
    nacimiento?: Date;
    rol?: string;
}
export {};
