import { Servicio } from 'src/servicios/entities/servicio.entity';
export declare class NecesidadHoraria {
    id: number;
    servicio: Servicio;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    fechaInicio: string;
    fechaFin: string;
}
