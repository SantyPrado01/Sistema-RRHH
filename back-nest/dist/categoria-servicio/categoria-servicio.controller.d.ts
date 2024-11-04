import { CategoriaServicioService } from './categoria-servicio.service';
import { CreateCategoriaServicioDto } from './dto/create-categoria-servicio.dto';
import { UpdateCategoriaServicioDto } from './dto/update-categoria-servicio.dto';
export declare class CategoriaServicioController {
    private readonly categoriaServicioService;
    constructor(categoriaServicioService: CategoriaServicioService);
    create(createCategoriaServicioDto: CreateCategoriaServicioDto): Promise<import("@nestjs/common").HttpException | {
        message: string;
        categoriaServicio: import("./entities/categoria-servicio.entity").CategoriaServicio;
    }>;
    findAll(): Promise<import("./entities/categoria-servicio.entity").CategoriaServicio[]>;
    findOne(id: string): Promise<import("@nestjs/common").HttpException | import("./entities/categoria-servicio.entity").CategoriaServicio>;
    update(id: string, updateCategoriaServicioDto: UpdateCategoriaServicioDto): Promise<import("@nestjs/common").HttpException | (import("./entities/categoria-servicio.entity").CategoriaServicio & UpdateCategoriaServicioDto)>;
    remove(id: string): Promise<import("@nestjs/common").HttpException>;
}
