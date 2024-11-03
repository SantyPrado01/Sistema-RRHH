import { NecesidadHorariaService } from './necesidadHoraria.service';
import { UpdateNecesidadHorariaDto } from './dto/updateNecesidadHoraria.dto';
export declare class NecesidadHorariaController {
    private readonly necesidadHorariaService;
    constructor(necesidadHorariaService: NecesidadHorariaService);
    findAll(): Promise<import("./entities/necesidadHoraria.entity").NecesidadHoraria[]>;
    findOne(id: string): Promise<import("./entities/necesidadHoraria.entity").NecesidadHoraria>;
    update(id: string, updateNecesidadHorariaDto: UpdateNecesidadHorariaDto): Promise<import("./entities/necesidadHoraria.entity").NecesidadHoraria>;
    remove(id: string): Promise<void>;
}
