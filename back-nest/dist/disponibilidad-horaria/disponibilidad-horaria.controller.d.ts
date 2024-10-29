import { DisponibilidadHorariaService } from './disponibilidad-horaria.service';
import { CreateDisponibilidadHorariaDto } from './dto/create-disponibilidad-horaria.dto';
import { UpdateDisponibilidadHorariaDto } from './dto/update-disponibilidad-horaria.dto';
export declare class DisponibilidadHorariaController {
    private readonly disponibilidadHorariaService;
    constructor(disponibilidadHorariaService: DisponibilidadHorariaService);
    create(createDisponibilidadHorariaDto: CreateDisponibilidadHorariaDto): Promise<import("./entities/disponibilidad-horaria.entity").DisponibilidadHoraria>;
    findAll(): Promise<import("./entities/disponibilidad-horaria.entity").DisponibilidadHoraria[]>;
    findOne(id: string): Promise<import("./entities/disponibilidad-horaria.entity").DisponibilidadHoraria>;
    update(id: string, updateDisponibilidadHorariaDto: UpdateDisponibilidadHorariaDto): Promise<import("./entities/disponibilidad-horaria.entity").DisponibilidadHoraria>;
    remove(id: string): Promise<void>;
}
