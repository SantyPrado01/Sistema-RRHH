import { DisponibilidadHorariaService } from './disponibilidad-horaria.service';
import { UpdateDisponibilidadHorariaDto } from './dto/update-disponibilidad-horaria.dto';
export declare class DisponibilidadHorariaController {
    private readonly disponibilidadHorariaService;
    constructor(disponibilidadHorariaService: DisponibilidadHorariaService);
    findAll(): Promise<import("./entities/disponibilidad-horaria.entity").DisponibilidadHoraria[]>;
    findOne(id: string): Promise<import("./entities/disponibilidad-horaria.entity").DisponibilidadHoraria>;
    update(id: string, updateDisponibilidadHorariaDto: UpdateDisponibilidadHorariaDto): Promise<import("./entities/disponibilidad-horaria.entity").DisponibilidadHoraria>;
    remove(id: string): Promise<void>;
}
