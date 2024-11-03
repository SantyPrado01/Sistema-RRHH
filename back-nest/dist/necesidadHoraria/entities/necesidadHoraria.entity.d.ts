import { OrdenTrabajo } from 'src/ordenTrabajo/entities/ordenTrabajo.entity';
export declare class NecesidadHoraria {
    necesidadHorariaId: number;
    ordenTrabajo: OrdenTrabajo;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
}
