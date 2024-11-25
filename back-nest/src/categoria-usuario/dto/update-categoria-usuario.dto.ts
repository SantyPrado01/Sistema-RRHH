import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaUsuarioDto } from './create-categoria-usuario.dto';

export class UpdateCategoriaUsuarioDto extends PartialType(CreateCategoriaUsuarioDto) {
    nombre?: string;
    eliminado?: boolean;

}
