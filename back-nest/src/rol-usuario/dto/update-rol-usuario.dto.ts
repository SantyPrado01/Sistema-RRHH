import { PartialType } from '@nestjs/mapped-types';
import { CreateRolUsuarioDto } from './create-rol-usuario.dto';

export class UpdateRolUsuarioDto extends PartialType(CreateRolUsuarioDto) {
    nombre?: string
}
