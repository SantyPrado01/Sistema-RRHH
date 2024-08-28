import { CreateCategoriaEmpleadoDto } from './dto/create-categoria-empleado.dto';
import { UpdateCategoriaEmpleadoDto } from './dto/update-categoria-empleado.dto';
export declare class CategoriaEmpleadoService {
    create(createCategoriaEmpleadoDto: CreateCategoriaEmpleadoDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCategoriaEmpleadoDto: UpdateCategoriaEmpleadoDto): string;
    remove(id: number): string;
}
