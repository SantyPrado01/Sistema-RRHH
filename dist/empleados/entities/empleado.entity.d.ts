import { DisponibilidadHoraria } from "src/disponibilidad-horaria/entities/disponibilidad-horaria.entity";
import { CategoriaEmpleado } from "src/categoria-empleado/entities/categoria-empleado.entity";
import { Ciudad } from "src/ciudad/entities/ciudad.entity";
export declare class Empleado {
    id: number;
    legajo: number;
    nombre: string;
    apellido: string;
    nroDocumento: number;
    telefono: number;
    email: string;
    fechaIngreso: Date;
    eliminado: number;
    categorias: CategoriaEmpleado;
    disponibilidades: DisponibilidadHoraria[];
    ciudad: Ciudad[];
}
