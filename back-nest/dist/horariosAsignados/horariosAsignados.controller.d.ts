import { HorarioAsignadoService } from './horariosAsignados.service';
import { CreateHorariosAsignadoDto } from './dto/createHorariosAsignados.dto';
import { UpdateHorariosAsignadoDto } from './dto/updateHorariosAsignados.entity';
import { HorarioAsignado } from './entities/horariosAsignados.entity';
export declare class HorariosAsignadosController {
    private readonly horariosAsignadosService;
    constructor(horariosAsignadosService: HorarioAsignadoService);
    create(createHorariosDto: CreateHorariosAsignadoDto): Promise<any[]>;
    getHorariosAsignados(): Promise<HorarioAsignado[]>;
    findAll(): Promise<HorarioAsignado[]>;
    findOne(id: string): Promise<HorarioAsignado>;
    update(id: string, updateHorariosAsignadoDto: UpdateHorariosAsignadoDto): Promise<HorarioAsignado>;
    remove(id: string): Promise<void>;
}
