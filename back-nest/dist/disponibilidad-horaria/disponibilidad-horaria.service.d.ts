import { Repository } from 'typeorm';
import { DisponibilidadHoraria } from './entities/disponibilidad-horaria.entity';
import { CreateDisponibilidadHorariaDto } from './dto/create-disponibilidad-horaria.dto';
import { UpdateDisponibilidadHorariaDto } from './dto/update-disponibilidad-horaria.dto';
import { EmpleadosService } from 'src/empleados/empleados.service';
export declare class DisponibilidadHorariaService {
    private readonly disponibilidadHorariaRepository;
    private readonly empleadoService;
    constructor(disponibilidadHorariaRepository: Repository<DisponibilidadHoraria>, empleadoService: EmpleadosService);
    create(createDisponibilidadHorariaDto: CreateDisponibilidadHorariaDto): Promise<DisponibilidadHoraria>;
    findAll(): Promise<DisponibilidadHoraria[]>;
    findOne(id: number): Promise<DisponibilidadHoraria>;
    update(id: number, updateDisponibilidadHorariaDto: UpdateDisponibilidadHorariaDto): Promise<DisponibilidadHoraria>;
    remove(id: number): Promise<void>;
}
