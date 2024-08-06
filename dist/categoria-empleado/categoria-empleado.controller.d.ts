import { CategoriaEmpleadoService } from './categoria-empleado.service';
import { CreateCategoriaEmpleadoDto } from './dto/create-categoria-empleado.dto';
import { UpdateCategoriaEmpleadoDto } from './dto/update-categoria-empleado.dto';
export declare class CategoriaEmpleadoController {
    private readonly categoriaEmpleadoService;
    constructor(categoriaEmpleadoService: CategoriaEmpleadoService);
    create(createCategoriaEmpleadoDto: CreateCategoriaEmpleadoDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCategoriaEmpleadoDto: UpdateCategoriaEmpleadoDto): string;
    remove(id: string): string;
}
