import { DisponibilidadHoraria } from "../../disponibilidad-horaria/entities/disponibilidad-horaria.entity";
import { CategoriaEmpleado } from "../../categoria-empleado/entities/categoria-empleado.entity";
export declare class Empleado {
    empleadoId: number;
    legajo: number;
    nombre: string;
    apellido: string;
    nroDocumento: number;
    telefono: string;
    email: string;
    fechaIngreso: Date;
    eliminado: boolean;
    ciudad: number;
    observaciones: string;
    categoria: CategoriaEmpleado;
    disponibilidad: DisponibilidadHoraria;
}
