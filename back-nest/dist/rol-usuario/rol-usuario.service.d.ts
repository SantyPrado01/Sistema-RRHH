import { HttpException } from '@nestjs/common';
import { CreateRolUsuarioDto } from './dto/create-rol-usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol-usuario.dto';
import { RolUsuario } from './entities/rol-usuario.entity';
import { Repository } from 'typeorm';
export declare class RolUsuarioService {
    private rolUsuarioRepository;
    constructor(rolUsuarioRepository: Repository<RolUsuario>);
    createRolUsuario(rolUsuario: CreateRolUsuarioDto): Promise<HttpException | {
        message: string;
        rolUsuario: RolUsuario;
    }>;
    getRolUsuarios(): Promise<RolUsuario[]>;
    getRolUsuario(nombreRolUsuario: string): Promise<RolUsuario>;
    getRolUsuarioId(id: number): Promise<RolUsuario | HttpException>;
    deleteRolUsuario(id: number): Promise<HttpException>;
    updateRolUsuario(id: number, rolUsuario: UpdateRolUsuarioDto): Promise<any>;
}
