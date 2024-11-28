import { Empleado } from "../../empleados/entities/empleado.entity";
export declare class Categorias {
    id: number;
    nombre: string;
    eliminado: boolean;
    empleados?: Empleado;
    servicios?: Empleado;
}
