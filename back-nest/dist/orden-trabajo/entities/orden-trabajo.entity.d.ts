import { Empleado } from "../../empleados/entities/empleado.entity";
import { HorarioAsignado } from "../../horarios-asignados/entities/horarios-asignado.entity";
import { NecesidadHoraria } from "../../necesidad-horaria/entities/necesidad-horaria.entity";
import { Servicio } from "../../servicios/entities/servicio.entity";
export declare class OrdenTrabajo {
    ordenTrabajoId: number;
    servicio: Servicio;
    empleadoAsignado: Empleado;
    horariosAsignados?: HorarioAsignado[];
    mes: number;
    anio: number;
    necesidadHoraria?: NecesidadHoraria[];
}
