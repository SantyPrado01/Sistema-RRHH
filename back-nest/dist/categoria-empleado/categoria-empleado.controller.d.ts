import { CategoriaEmpleadoService } from './categoria-empleado.service';
import { CreateCategoriaEmpleadoDto } from './dto/create-categoria-empleado.dto';
import { UpdateCategoriaEmpleadoDto } from './dto/update-categoria-empleado.dto';
export declare class CategoriaEmpleadoController {
    private readonly categoriaEmpleadoService;
    constructor(categoriaEmpleadoService: CategoriaEmpleadoService);
    create(createCategoriaEmpleadoDto: CreateCategoriaEmpleadoDto): Promise<import("@nestjs/common").HttpException | {
        message: string;
        categoriaEmpleado: import("./entities/categoria-empleado.entity").CategoriaEmpleado;
    }>;
    findAll(): Promise<import("./entities/categoria-empleado.entity").CategoriaEmpleado[]>;
    findOne(id: string): Promise<import("@nestjs/common").HttpException | import("./entities/categoria-empleado.entity").CategoriaEmpleado>;
    update(id: string, updateCategoriaEmpleadoDto: UpdateCategoriaEmpleadoDto): Promise<import("@nestjs/common").HttpException | (import("./entities/categoria-empleado.entity").CategoriaEmpleado & UpdateCategoriaEmpleadoDto)>;
    remove(id: string): Promise<import("@nestjs/common").HttpException>;
}
