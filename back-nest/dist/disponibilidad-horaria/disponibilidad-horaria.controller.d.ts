import { DisponibilidadHorariaService } from './disponibilidad-horaria.service';
import { CreateDisponibilidadHorariaDto } from './dto/create-disponibilidad-horaria.dto';
import { UpdateDisponibilidadHorariaDto } from './dto/update-disponibilidad-horaria.dto';
export declare class DisponibilidadHorariaController {
    private readonly disponibilidadHorariaService;
    constructor(disponibilidadHorariaService: DisponibilidadHorariaService);
    create(createDisponibilidadHorariaDto: CreateDisponibilidadHorariaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateDisponibilidadHorariaDto: UpdateDisponibilidadHorariaDto): string;
    remove(id: string): string;
}
