import { Empleado } from "src/empleados/entities/empleado.entity";
export declare class DisponibilidadHoraria {
    id: number;
    empleado: Empleado;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    fechaInicio: string;
    fechaFin: string;
}
