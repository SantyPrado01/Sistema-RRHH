import { Repository } from 'typeorm';
import { OrdenTrabajo } from './entities/ordenTrabajo.entity';
import { CreateOrdenTrabajoDto } from './dto/createOrdenTrabajo.dto';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { UpdateOrdenTrabajoDto } from './dto/updateOrdenTrabajo.dto';
import { CreateNecesidadHorariaDto } from 'src/necesidadHoraria/dto/createNecesidadHoraria.dto';
import { NecesidadHoraria } from 'src/necesidadHoraria/entities/necesidadHoraria.entity';
import { HorarioAsignado } from 'src/horariosAsignados/entities/horariosAsignados.entity';
export declare class OrdenTrabajoService {
    private readonly ordenTrabajoRepository;
    private readonly empleadoRepository;
    private readonly servicioRepository;
    private readonly necesidadHorariaRepository;
    private readonly horarioAsignadoRepository;
    constructor(ordenTrabajoRepository: Repository<OrdenTrabajo>, empleadoRepository: Repository<Empleado>, servicioRepository: Repository<Servicio>, necesidadHorariaRepository: Repository<NecesidadHoraria>, horarioAsignadoRepository: Repository<HorarioAsignado>);
    createOrdenTrabajo(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    createNecesidadHoraria(ordenTrabajoId: number, necesidadesHorarias: CreateNecesidadHorariaDto[]): Promise<NecesidadHoraria[]>;
    createAsignarHorarios(ordenTrabajoId: number): Promise<any[]>;
    private obtenerFechasDelMes;
    findAll(): Promise<OrdenTrabajo[]>;
    findOne(id: number): Promise<OrdenTrabajo>;
    update(id: number, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    remove(id: number): Promise<void>;
}
