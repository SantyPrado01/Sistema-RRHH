import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdenTrabajoDto } from './createOrdenTrabajo.dto'; 

export class UpdateOrdenTrabajoDto extends PartialType(CreateOrdenTrabajoDto) {}