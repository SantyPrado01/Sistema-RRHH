import { CreateNecesidadHorariaDto } from './dto/create-necesidad-horaria.dto';
import { UpdateNecesidadHorariaDto } from './dto/update-necesidad-horaria.dto';
export declare class NecesidadHorariaService {
    create(createNecesidadHorariaDto: CreateNecesidadHorariaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateNecesidadHorariaDto: UpdateNecesidadHorariaDto): string;
    remove(id: number): string;
}
