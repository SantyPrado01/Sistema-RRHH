import { HorarioAsignadoService } from './horarios-asignados.service';
import { CreateHorariosAsignadoDto } from './dto/create-horarios-asignado.dto';
import { UpdateHorariosAsignadoDto } from './dto/update-horarios-asignado.dto';
import { HorarioAsignado } from './entities/horarios-asignado.entity';
export declare class HorariosAsignadosController {
    private readonly horariosAsignadosService;
    constructor(horariosAsignadosService: HorarioAsignadoService);
    create(createHorariosDto: CreateHorariosAsignadoDto): Promise<HorarioAsignado[]>;
    findAll(): Promise<HorarioAsignado[]>;
    findOne(id: string): Promise<HorarioAsignado>;
    update(id: string, updateHorariosAsignadoDto: UpdateHorariosAsignadoDto): Promise<HorarioAsignado>;
    remove(id: string): Promise<void>;
}
