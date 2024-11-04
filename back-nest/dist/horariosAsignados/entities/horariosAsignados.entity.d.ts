import { Empleado } from "../../empleados/entities/empleado.entity";
import { OrdenTrabajo } from "src/ordenTrabajo/entities/ordenTrabajo.entity";
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
    comprobado: boolean;
}
