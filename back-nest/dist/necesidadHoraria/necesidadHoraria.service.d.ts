import { UpdateNecesidadHorariaDto } from './dto/updateNecesidadHoraria.dto';
import { NecesidadHoraria } from './entities/necesidadHoraria.entity';
import { Repository } from 'typeorm';
import { OrdenTrabajoService } from 'src/ordenTrabajo/ordenTrabajo.service';
export declare class NecesidadHorariaService {
    private readonly necesidadHorariaRepository;
    private readonly ordenTrabajoService;
    constructor(necesidadHorariaRepository: Repository<NecesidadHoraria>, ordenTrabajoService: OrdenTrabajoService);
    findAll(): Promise<NecesidadHoraria[]>;
    findOne(id: number): Promise<NecesidadHoraria>;
    update(id: number, updateNecesidadHorariaDto: UpdateNecesidadHorariaDto): Promise<NecesidadHoraria>;
    remove(id: number): Promise<void>;
}
