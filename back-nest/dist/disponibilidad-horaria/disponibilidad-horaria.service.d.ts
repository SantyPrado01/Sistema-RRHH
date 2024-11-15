import { Repository } from 'typeorm';
import { DisponibilidadHoraria } from './entities/disponibilidad-horaria.entity';
import { UpdateDisponibilidadHorariaDto } from './dto/update-disponibilidad-horaria.dto';
import { Empleado } from 'src/empleados/entities/empleado.entity';
export declare class DisponibilidadHorariaService {
    private readonly disponibilidadHorariaRepository;
    private readonly empleadoService;
    constructor(disponibilidadHorariaRepository: Repository<DisponibilidadHoraria>, empleadoService: Repository<Empleado>);
    findAll(): Promise<DisponibilidadHoraria[]>;
    findOne(id: number): Promise<DisponibilidadHoraria>;
    update(id: number, updateDisponibilidadHorariaDto: UpdateDisponibilidadHorariaDto): Promise<DisponibilidadHoraria>;
    remove(id: number): Promise<void>;
}
