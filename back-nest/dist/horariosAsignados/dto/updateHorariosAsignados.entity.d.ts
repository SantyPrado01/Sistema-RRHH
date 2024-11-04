import { CreateHorariosAsignadoDto } from './createHorariosAsignados.dto';
import { Empleado } from 'src/empleados/entities/empleado.entity';
declare const UpdateHorariosAsignadoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateHorariosAsignadoDto>>;
export declare class UpdateHorariosAsignadoDto extends UpdateHorariosAsignadoDto_base {
    horarioAsignadoId: number;
    ordenTrabajoId: number;
    empleadoAsignadoId: number;
    empleadoSuplente?: Empleado;
    fecha: String;
    horaInicioProyectado: string;
    horaFinProyectado: string;
    horaInicioReal?: string;
    horaFinReal?: string;
    estado?: string;
    suplente?: boolean;
    comprobado: boolean;
}
export {};
