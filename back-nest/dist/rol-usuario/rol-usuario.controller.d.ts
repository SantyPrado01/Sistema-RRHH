import { RolUsuarioService } from './rol-usuario.service';
import { CreateRolUsuarioDto } from './dto/create-rol-usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol-usuario.dto';
export declare class RolUsuarioController {
    private readonly rolUsuarioService;
    constructor(rolUsuarioService: RolUsuarioService);
    create(createRolUsuarioDto: CreateRolUsuarioDto): Promise<import("@nestjs/common").HttpException | {
        message: string;
        rolUsuario: import("./entities/rol-usuario.entity").RolUsuario;
    }>;
    findAll(): Promise<import("./entities/rol-usuario.entity").RolUsuario[]>;
    findOne(id: string): Promise<import("./entities/rol-usuario.entity").RolUsuario | import("@nestjs/common").HttpException>;
    update(id: string, updateRolUsuarioDto: UpdateRolUsuarioDto): Promise<any>;
    remove(id: string): Promise<import("@nestjs/common").HttpException>;
}
