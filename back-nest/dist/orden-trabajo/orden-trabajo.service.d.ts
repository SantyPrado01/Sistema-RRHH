import { Repository } from 'typeorm';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { UpdateOrdenTrabajoDto } from './dto/update-orden-trabajo.dto';
import { CreateNecesidadHorariaDto } from 'src/necesidad-horaria/dto/create-necesidad-horaria.dto';
import { NecesidadHoraria } from 'src/necesidad-horaria/entities/necesidad-horaria.entity';
import { HorarioAsignado } from 'src/horarios-asignados/entities/horarios-asignado.entity';
export declare class OrdenTrabajoService {
    private readonly ordenTrabajoRepository;
    private readonly empleadoRepository;
    private readonly servicioRepository;
    private readonly necesidadHorariaRepository;
    private readonly horarioAsignadoRepository;
    constructor(ordenTrabajoRepository: Repository<OrdenTrabajo>, empleadoRepository: Repository<Empleado>, servicioRepository: Repository<Servicio>, necesidadHorariaRepository: Repository<NecesidadHoraria>, horarioAsignadoRepository: Repository<HorarioAsignado>);
    create(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    addNecesidadHoraria(ordenTrabajoId: number, necesidadesHorarias: CreateNecesidadHorariaDto[]): Promise<NecesidadHoraria[]>;
    asignarHorarios(ordenTrabajoId: number): Promise<any[]>;
    private obtenerFechasDelMes;
    findAll(): Promise<OrdenTrabajo[]>;
    findOne(id: number): Promise<OrdenTrabajo>;
    update(id: number, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    remove(id: number): Promise<void>;
}
