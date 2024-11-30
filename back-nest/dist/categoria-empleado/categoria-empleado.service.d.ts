import { HttpException } from '@nestjs/common';
import { CreateCategoriaEmpleadoDto } from './dto/create-categoria-empleado.dto';
import { UpdateCategoriaEmpleadoDto } from './dto/update-categoria-empleado.dto';
import { Categorias } from './entities/categoria-empleado.entity';
import { Repository } from 'typeorm';
export declare class CategoriaEmpleadoService {
    private categoriaEmpleadoRepository;
    constructor(categoriaEmpleadoRepository: Repository<Categorias>);
    create(categoriaEmpleado: CreateCategoriaEmpleadoDto): Promise<HttpException | {
        message: string;
        categoriaEmpleado: Categorias;
    }>;
    get(): Promise<Categorias[]>;
    getNombre(categoriaEmpleadoNombre: string): Promise<Categorias>;
    getId(categoriaEmpleadoId: number): Promise<HttpException | Categorias>;
    delete(categoriaEmpleadoId: number): Promise<HttpException>;
    update(categoriaEmpleadoId: number, categoriaEmpleado: UpdateCategoriaEmpleadoDto): Promise<HttpException | (Categorias & UpdateCategoriaEmpleadoDto)>;
}
