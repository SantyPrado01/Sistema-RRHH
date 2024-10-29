import { Empleado } from "src/empleados/entities/empleado.entity";
export declare class CreateHorariosAsignadoDto {
    horarioAsignadoId: number;
    ordenTrabajoId: number;
    empleadoAsignadoId: number;
    empleadoSuplente?: Empleado;
    fecha: Date;
    horaInicioProyectado: string;
    horaFinProyectado: string;
    horaInicioReal?: string;
    horaFinReal?: string;
    estado?: string;
    suplente?: boolean;
}
