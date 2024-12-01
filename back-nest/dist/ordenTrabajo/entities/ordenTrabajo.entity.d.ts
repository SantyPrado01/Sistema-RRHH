import { Empleado } from "../../empleados/entities/empleado.entity";
import { HorarioAsignado } from "src/horariosAsignados/entities/horariosAsignados.entity";
import { NecesidadHoraria } from "src/necesidadHoraria/entities/necesidadHoraria.entity";
import { Servicio } from "../../servicios/entities/servicio.entity";
export declare class OrdenTrabajo {
    Id: number;
    servicio: Servicio;
    empleadoAsignado: Empleado;
    horariosAsignados?: HorarioAsignado[];
    necesidadHoraria?: NecesidadHoraria[];
    mes?: number;
    anio?: number;
    diaEspecifico?: Date;
    horaInicio?: string;
    horaFin?: string;
    completado: boolean;
    eliminado?: boolean;
    fechaEliminado?: Date;
}
