import { NecesidadHorariaService } from './necesidad-horaria.service';
import { CreateNecesidadHorariaDto } from './dto/create-necesidad-horaria.dto';
import { UpdateNecesidadHorariaDto } from './dto/update-necesidad-horaria.dto';
export declare class NecesidadHorariaController {
    private readonly necesidadHorariaService;
    constructor(necesidadHorariaService: NecesidadHorariaService);
    create(createNecesidadHorariaDto: CreateNecesidadHorariaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateNecesidadHorariaDto: UpdateNecesidadHorariaDto): string;
    remove(id: string): string;
}
