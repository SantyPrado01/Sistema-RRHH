import { HorariosAsignadosService } from './horarios-asignados.service';
import { CreateHorariosAsignadoDto } from './dto/create-horarios-asignado.dto';
import { UpdateHorariosAsignadoDto } from './dto/update-horarios-asignado.dto';
export declare class HorariosAsignadosController {
    private readonly horariosAsignadosService;
    constructor(horariosAsignadosService: HorariosAsignadosService);
    create(createHorariosAsignadoDto: CreateHorariosAsignadoDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateHorariosAsignadoDto: UpdateHorariosAsignadoDto): string;
    remove(id: string): string;
}
