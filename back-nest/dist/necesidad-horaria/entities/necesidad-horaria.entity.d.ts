import { OrdenTrabajo } from 'src/orden-trabajo/entities/orden-trabajo.entity';
export declare class NecesidadHoraria {
    necesidadHorariaId: number;
    ordenTrabajo: OrdenTrabajo;
    diaSemana: number;
    horaInicio: string;
    horaFin: string;
    fechaInicio: string;
    fechaFin: string;
}
