import { HttpException } from '@nestjs/common';
import { CreateCategoriaEmpleadoDto } from './dto/create-categoria-empleado.dto';
import { UpdateCategoriaEmpleadoDto } from './dto/update-categoria-empleado.dto';
import { CategoriaEmpleado } from './entities/categoria-empleado.entity';
import { Repository } from 'typeorm';
export declare class CategoriaEmpleadoService {
    private categoriaEmpleadoRepository;
    constructor(categoriaEmpleadoRepository: Repository<CategoriaEmpleado>);
    createCategoriaEmpleado(categoriaEmpleado: CreateCategoriaEmpleadoDto): Promise<HttpException | {
        message: string;
        categoriaEmpleado: CategoriaEmpleado;
    }>;
    getCategoriasEmpleados(): Promise<CategoriaEmpleado[]>;
    getCategoriaEmpleado(categoriaEmpleadoNombre: string): Promise<CategoriaEmpleado>;
    getCategoriaEmpleadoId(categoriaEmpleadoId: number): Promise<HttpException | CategoriaEmpleado>;
    deleteCategoriaServicio(categoriaEmpleadoId: number): Promise<HttpException>;
    updateCategoriaEmpleado(categoriaEmpleadoId: number, categoriaEmpleado: UpdateCategoriaEmpleadoDto): Promise<HttpException | (CategoriaEmpleado & UpdateCategoriaEmpleadoDto)>;
}
