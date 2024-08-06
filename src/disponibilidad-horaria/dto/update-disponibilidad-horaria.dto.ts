import { PartialType } from '@nestjs/mapped-types';
import { CreateDisponibilidadHorariaDto } from './create-disponibilidad-horaria.dto';

export class UpdateDisponibilidadHorariaDto extends PartialType(CreateDisponibilidadHorariaDto) {

    empleadoID?: number;
    diaSemana?: number;
    horaInicio?: string;
    horaFin?: string;
    fehcaInicio?: string;
    fechaFin?: string;

}
