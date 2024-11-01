import { OrdenTrabajo } from '../../orden-trabajo/entities/orden-trabajo.entity';
export declare class NecesidadHoraria {
    necesidadHorariaId: number;
    ordenTrabajo: OrdenTrabajo;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
}
