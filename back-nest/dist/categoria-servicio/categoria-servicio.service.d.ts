import { HttpException } from '@nestjs/common';
import { CreateCategoriaServicioDto } from './dto/create-categoria-servicio.dto';
import { UpdateCategoriaServicioDto } from './dto/update-categoria-servicio.dto';
import { CategoriaServicio } from './entities/categoria-servicio.entity';
import { Repository } from 'typeorm';
export declare class CategoriaServicioService {
    private categoriaServicioRepository;
    constructor(categoriaServicioRepository: Repository<CategoriaServicio>);
    create(categoriaServicio: CreateCategoriaServicioDto): Promise<HttpException | {
        message: string;
        categoriaServicio: CategoriaServicio;
    }>;
    get(): Promise<CategoriaServicio[]>;
    getNombre(nombreCategoriaServico: string): Promise<CategoriaServicio>;
    getId(categoriaServicioId: number): Promise<HttpException | CategoriaServicio>;
    delete(categoriaServicioId: number): Promise<HttpException>;
    update(categoriaServicioId: number, categoriaServicio: UpdateCategoriaServicioDto): Promise<HttpException | (CategoriaServicio & UpdateCategoriaServicioDto)>;
}
