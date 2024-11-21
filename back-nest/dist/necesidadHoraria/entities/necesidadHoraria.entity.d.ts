import { OrdenTrabajo } from 'src/ordenTrabajo/entities/ordenTrabajo.entity';
export declare class NecesidadHoraria {
    necesidadHorariaId: number;
    ordenTrabajo: OrdenTrabajo;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
}
