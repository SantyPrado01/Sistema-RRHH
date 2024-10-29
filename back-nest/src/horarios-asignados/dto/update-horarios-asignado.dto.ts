import { PartialType } from '@nestjs/mapped-types';
import { CreateHorariosAsignadoDto } from './create-horarios-asignado.dto';

export class UpdateHorariosAsignadoDto extends PartialType(CreateHorariosAsignadoDto) {}
