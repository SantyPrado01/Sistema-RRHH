import { CategoriaServicioService } from './categoria-servicio.service';
import { CreateCategoriaServicioDto } from './dto/create-categoria-servicio.dto';
import { UpdateCategoriaServicioDto } from './dto/update-categoria-servicio.dto';
export declare class CategoriaServicioController {
    private readonly categoriaServicioService;
    constructor(categoriaServicioService: CategoriaServicioService);
    create(createCategoriaServicioDto: CreateCategoriaServicioDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCategoriaServicioDto: UpdateCategoriaServicioDto): string;
    remove(id: string): string;
}
