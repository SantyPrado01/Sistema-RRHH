import { CreateEmpleadoDto } from './create-empleado.dto';
declare const UpdateEmpleadoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateEmpleadoDto>>;
export declare class UpdateEmpleadoDto extends UpdateEmpleadoDto_base {
    legajo?: number;
    nombre?: string;
    apellido?: string;
    nroDocumento?: number;
    telefono?: number;
    email?: string;
    fechaIngreso?: Date;
    eliminado?: boolean;
    categoriasID?: number;
    disponibilidadID?: number;
    ciudadID?: number;
}
export {};
