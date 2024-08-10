import { Empleado } from "src/empleados/entities/empleado.entity";
import { Servicio } from "src/servicios/entities/servicio.entity";
export declare class Ciudad {
    idCiudad: number;
    nombreCiudad: string;
    empleados: Empleado[];
    servicios: Servicio[];
}
