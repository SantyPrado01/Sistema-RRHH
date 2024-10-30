import { NecesidadHorariaService } from './necesidad-horaria.service';
import { CreateNecesidadHorariaDto } from './dto/create-necesidad-horaria.dto';
import { UpdateNecesidadHorariaDto } from './dto/update-necesidad-horaria.dto';
export declare class NecesidadHorariaController {
    private readonly necesidadHorariaService;
    constructor(necesidadHorariaService: NecesidadHorariaService);
    create(createNecesidadHorariaDto: CreateNecesidadHorariaDto): Promise<import("./entities/necesidad-horaria.entity").NecesidadHoraria>;
    findAll(): Promise<import("./entities/necesidad-horaria.entity").NecesidadHoraria[]>;
    findOne(id: string): Promise<import("./entities/necesidad-horaria.entity").NecesidadHoraria>;
    update(id: string, updateNecesidadHorariaDto: UpdateNecesidadHorariaDto): Promise<import("./entities/necesidad-horaria.entity").NecesidadHoraria>;
    remove(id: string): Promise<void>;
}
