import { Empleado } from "../../empleados/entities/empleado.entity";
export declare class DisponibilidadHoraria {
    disponibilidadHorariaId: number;
    empleado: Empleado;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    fechaInicio: string;
    fechaFin: string;
}
