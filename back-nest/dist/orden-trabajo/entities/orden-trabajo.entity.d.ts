import { Empleado } from "src/empleados/entities/empleado.entity";
import { HorarioAsignado } from "src/horarios-asignados/entities/horarios-asignado.entity";
import { Servicio } from "src/servicios/entities/servicio.entity";
export declare class OrdenTrabajo {
    ordenTrabajoId: number;
    servicio: Servicio;
    empleadoAsignado: Empleado;
    horariosAsignados: HorarioAsignado[];
    mes: number;
    anio: number;
    dias: string[];
    horaInicio: string;
    horaFin: string;
}
