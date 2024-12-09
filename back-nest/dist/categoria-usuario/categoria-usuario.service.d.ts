import { HttpException } from '@nestjs/common';
import { CreateCategoriaUsuarioDto } from './dto/create-categoria-usuario.dto';
import { UpdateCategoriaUsuarioDto } from './dto/update-categoria-usuario.dto';
import { CategoriaUsuario } from './entities/categoria-usuario.entity';
import { Repository } from 'typeorm';
export declare class CategoriaUsuarioService {
    private categoriaUsuarioRepository;
    constructor(categoriaUsuarioRepository: Repository<CategoriaUsuario>);
    create(categoriaUsuario: CreateCategoriaUsuarioDto): Promise<HttpException | {
        message: string;
        categoriaUsuario: CategoriaUsuario;
    }>;
    findAll(): Promise<CategoriaUsuario[]>;
    findName(nombreCategoriaUsuario: string): Promise<CategoriaUsuario>;
    findOne(categoriaUsuarioId: number): Promise<CategoriaUsuario | HttpException>;
    update(categoriaUsuarioId: number, categoriaUsuario: UpdateCategoriaUsuarioDto): Promise<HttpException | (CategoriaUsuario & UpdateCategoriaUsuarioDto)>;
    remove(categoriaUsuarioId: number): Promise<HttpException>;
}
