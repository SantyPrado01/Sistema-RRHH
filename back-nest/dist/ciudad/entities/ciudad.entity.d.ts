import { Empleado } from "../../empleados/entities/empleado.entity";
import { Servicio } from "../../servicios/entities/servicio.entity";
export declare class Ciudad {
    idCiudad: number;
    nombreCiudad: string;
    eliminado: boolean;
    empleados: Empleado[];
    servicios: Servicio[];
}
