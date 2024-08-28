import { Servicio } from '../../servicios/entities/servicio.entity';
export declare class NecesidadHoraria {
    necesidadHorariaId: number;
    servicio: Servicio;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    fechaInicio: string;
    fechaFin: string;
}
