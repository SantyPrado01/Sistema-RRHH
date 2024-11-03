import { HorarioAsignadoService } from './horariosAsignados.service';
import { CreateHorariosAsignadoDto } from './dto/createHorariosAsignados.dto';
import { UpdateHorariosAsignadoDto } from './dto/updateHorariosAsignados.entity';
export declare class HorariosAsignadosController {
    private readonly horariosAsignadosService;
    constructor(horariosAsignadosService: HorarioAsignadoService);
    create(createHorariosDto: CreateHorariosAsignadoDto): Promise<any[]>;
    findAll(): Promise<import("./entities/horariosAsignados.entity").HorarioAsignado[]>;
    findOne(id: string): Promise<import("./entities/horariosAsignados.entity").HorarioAsignado>;
    update(id: string, updateHorariosAsignadoDto: UpdateHorariosAsignadoDto): Promise<import("./entities/horariosAsignados.entity").HorarioAsignado>;
    remove(id: string): Promise<void>;
}
