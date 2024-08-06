import { CreateCategoriaServicioDto } from './dto/create-categoria-servicio.dto';
import { UpdateCategoriaServicioDto } from './dto/update-categoria-servicio.dto';
export declare class CategoriaServicioService {
    create(createCategoriaServicioDto: CreateCategoriaServicioDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCategoriaServicioDto: UpdateCategoriaServicioDto): string;
    remove(id: number): string;
}
