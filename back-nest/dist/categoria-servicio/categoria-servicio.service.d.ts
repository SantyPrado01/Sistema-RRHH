import { HttpException } from '@nestjs/common';
import { CreateCategoriaServicioDto } from './dto/create-categoria-servicio.dto';
import { UpdateCategoriaServicioDto } from './dto/update-categoria-servicio.dto';
import { CategoriaServicio } from './entities/categoria-servicio.entity';
import { Repository } from 'typeorm';
export declare class CategoriaServicioService {
    private categoriaServicioRepository;
    constructor(categoriaServicioRepository: Repository<CategoriaServicio>);
    createCategoriaServicio(categoriaServicio: CreateCategoriaServicioDto): Promise<HttpException | {
        message: string;
        categoriaServicio: CategoriaServicio;
    }>;
    getCategoriasServicios(): Promise<CategoriaServicio[]>;
    getCategoriaServicio(nombreCategoriaServico: string): Promise<CategoriaServicio>;
    getCategoriaServicioId(categoriaServicioId: number): Promise<HttpException | CategoriaServicio>;
    deleteCategoriaServicio(categoriaServicioId: number): Promise<HttpException>;
    updateCategoriaServicio(categoriaServicioId: number, categoriaServicio: UpdateCategoriaServicioDto): Promise<HttpException | (CategoriaServicio & UpdateCategoriaServicioDto)>;
}
