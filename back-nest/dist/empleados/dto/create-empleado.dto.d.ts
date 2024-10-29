import { CategoriaEmpleado } from "src/categoria-empleado/entities/categoria-empleado.entity";
import { DisponibilidadHoraria } from "src/disponibilidad-horaria/entities/disponibilidad-horaria.entity";
export declare class CreateEmpleadoDto {
    legajo: number;
    nombre: string;
    apellido: string;
    nroDocumento: number;
    telefono: string;
    email: string;
    fechaIngreso?: Date;
    eliminado: boolean;
    ciudad: number;
    observaciones: string;
    categoriaEmpleado: CategoriaEmpleado;
    disponibilidades?: DisponibilidadHoraria[];
}
