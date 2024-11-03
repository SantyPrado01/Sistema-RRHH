import { PartialType } from '@nestjs/mapped-types';
import { CreateHorariosAsignadoDto } from './createHorariosAsignados.dto'; 

export class UpdateHorariosAsignadoDto extends PartialType(CreateHorariosAsignadoDto) {}