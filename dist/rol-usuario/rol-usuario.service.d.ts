import { CreateRolUsuarioDto } from './dto/create-rol-usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol-usuario.dto';
export declare class RolUsuarioService {
    create(createRolUsuarioDto: CreateRolUsuarioDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRolUsuarioDto: UpdateRolUsuarioDto): string;
    remove(id: number): string;
}
