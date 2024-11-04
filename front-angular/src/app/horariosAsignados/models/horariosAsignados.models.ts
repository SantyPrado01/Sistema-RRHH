import { Empleado } from "../../empleados/models/empleado.models";
import { OrdenTrabajo } from "../../ordenTrabajo/models/orden-trabajo.models";

export interface HorarioAsignado {
    horarioAsignadoId: number;
    ordenTrabajo: OrdenTrabajo;
    empleado: Empleado;
    empleadoSuplente?: Empleado;
    fecha: Date; 
    horaInicioProyectado: string;
    horaFinProyectado: string;
    horaInicioReal?: string; 
    horaFinReal?: string;    
    estado: string; 
    suplente: boolean;
    comprobado: boolean;
}