import { PartialType } from '@nestjs/mapped-types';
import { CreateDisponibilidadHorariaDto } from './create-disponibilidad-horaria.dto';

export class UpdateDisponibilidadHorariaDto extends PartialType(CreateDisponibilidadHorariaDto) {

    empleadoId?: number;
    diaSemana?: number;
    horaInicio?: string;
    horaFin?: string;

}
