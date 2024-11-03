import { PartialType } from '@nestjs/mapped-types';
import { CreateNecesidadHorariaDto } from './createNecesidadHoraria.dto'; 

export class UpdateNecesidadHorariaDto extends PartialType(CreateNecesidadHorariaDto) {
    ordenTrabajoId?: number;
    diaSemana?: string;
    horaInicio?: string;
    horaFin?: string;
}