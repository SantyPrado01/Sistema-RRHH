import { PartialType } from '@nestjs/mapped-types';
import { CreateNecesidadHorariaDto } from './create-necesidad-horaria.dto';

export class UpdateNecesidadHorariaDto extends PartialType(CreateNecesidadHorariaDto) {
    ordenTrabajoId?: number;
    diaSemana?: number;
    horaInicio?: string;
    horaFin?: string;
}
