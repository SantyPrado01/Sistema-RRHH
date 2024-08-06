import { RolUsuarioService } from './rol-usuario.service';
import { CreateRolUsuarioDto } from './dto/create-rol-usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol-usuario.dto';
export declare class RolUsuarioController {
    private readonly rolUsuarioService;
    constructor(rolUsuarioService: RolUsuarioService);
    create(createRolUsuarioDto: CreateRolUsuarioDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRolUsuarioDto: UpdateRolUsuarioDto): string;
    remove(id: string): string;
}
