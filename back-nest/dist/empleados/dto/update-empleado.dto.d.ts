import { CreateEmpleadoDto } from './create-empleado.dto';
import { DisponibilidadHoraria } from 'src/disponibilidad-horaria/entities/disponibilidad-horaria.entity';
import { CategoriaEmpleado } from 'src/categoria-empleado/entities/categoria-empleado.entity';
declare const UpdateEmpleadoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateEmpleadoDto>>;
export declare class UpdateEmpleadoDto extends UpdateEmpleadoDto_base {
    legajo?: number;
    nombre?: string;
    apellido?: string;
    nroDocumento?: number;
    telefono?: string;
    email?: string;
    fechaIngreso?: Date;
    eliminado?: boolean;
    ciudad?: number;
    observaciones?: string;
    categoriasEmpleado?: CategoriaEmpleado;
    disponibilidadHoraria?: DisponibilidadHoraria;
}
export {};
