import { DisponibilidadHoraria } from "../../disponibilidad-horaria/entities/disponibilidad-horaria.entity";
import { CategoriaEmpleado } from "../../categoria-empleado/entities/categoria-empleado.entity";
import { Ciudad } from "../../ciudad/entities/ciudad.entity";
export declare class Empleado {
    empleadoId: number;
    legajo: number;
    empleadoNombre: string;
    apellido: string;
    nroDocumento: number;
    telefono: number;
    email: string;
    fechaIngreso: Date;
    eliminado: boolean;
    categorias: CategoriaEmpleado;
    disponibilidades: DisponibilidadHoraria[];
    ciudad: Ciudad[];
}
