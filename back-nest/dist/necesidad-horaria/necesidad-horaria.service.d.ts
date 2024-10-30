import { CreateNecesidadHorariaDto } from './dto/create-necesidad-horaria.dto';
import { UpdateNecesidadHorariaDto } from './dto/update-necesidad-horaria.dto';
import { NecesidadHoraria } from './entities/necesidad-horaria.entity';
import { Repository } from 'typeorm';
import { OrdenTrabajoService } from 'src/orden-trabajo/orden-trabajo.service';
export declare class NecesidadHorariaService {
    private readonly necesidadHorariaRepository;
    private readonly ordenTrabajoService;
    constructor(necesidadHorariaRepository: Repository<NecesidadHoraria>, ordenTrabajoService: OrdenTrabajoService);
    create(createNecesidadHorariaDto: CreateNecesidadHorariaDto): Promise<NecesidadHoraria>;
    findAll(): Promise<NecesidadHoraria[]>;
    findOne(id: number): Promise<NecesidadHoraria>;
    update(id: number, updateNecesidadHorariaDto: UpdateNecesidadHorariaDto): Promise<NecesidadHoraria>;
    remove(id: number): Promise<void>;
}
