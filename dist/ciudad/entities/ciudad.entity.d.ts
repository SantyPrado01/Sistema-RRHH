import { Empleado } from "src/empleados/entities/empleado.entity";
import { Servicio } from "src/servicios/entities/servicio.entity";
export declare class Ciudad {
    id: number;
    name: string;
    empleados: Empleado[];
    servicios: Servicio[];
}
