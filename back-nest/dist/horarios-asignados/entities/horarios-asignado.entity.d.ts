import { Empleado } from "../../empleados/entities/empleado.entity";
import { OrdenTrabajo } from "../../orden-trabajo/entities/orden-trabajo.entity";
export declare class HorarioAsignado {
    horarioAsignadoId: number;
    ordenTrabajo: OrdenTrabajo;
    empleado: Empleado;
    empleadoSuplente?: Empleado;
    fecha: Date;
    horaInicioProyectado: string;
    horaFinProyectado: string;
    horaInicioReal: string;
    horaFinReal: string;
    estado: string;
    suplente: boolean;
}
