import { HttpException } from '@nestjs/common';
import { CreateCategoriaEmpleadoDto } from './dto/create-categoria-empleado.dto';
import { UpdateCategoriaEmpleadoDto } from './dto/update-categoria-empleado.dto';
import { CategoriaEmpleado } from './entities/categoria-empleado.entity';
import { Repository } from 'typeorm';
export declare class CategoriaEmpleadoService {
    private categoriaEmpleadoRepository;
    constructor(categoriaEmpleadoRepository: Repository<CategoriaEmpleado>);
    create(categoriaEmpleado: CreateCategoriaEmpleadoDto): Promise<HttpException | {
        message: string;
        categoriaEmpleado: CategoriaEmpleado;
    }>;
    get(): Promise<CategoriaEmpleado[]>;
    getNombre(categoriaEmpleadoNombre: string): Promise<CategoriaEmpleado>;
    getId(categoriaEmpleadoId: number): Promise<HttpException | CategoriaEmpleado>;
    delete(categoriaEmpleadoId: number): Promise<HttpException>;
    update(categoriaEmpleadoId: number, categoriaEmpleado: UpdateCategoriaEmpleadoDto): Promise<HttpException | (CategoriaEmpleado & UpdateCategoriaEmpleadoDto)>;
}
