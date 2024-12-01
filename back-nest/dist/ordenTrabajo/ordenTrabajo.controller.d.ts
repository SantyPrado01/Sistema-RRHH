import { OrdenTrabajoService } from './ordenTrabajo.service';
import { CreateOrdenTrabajoDto } from './dto/createOrdenTrabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/updateOrdenTrabajo.dto';
import { OrdenTrabajo } from './entities/ordenTrabajo.entity';
export declare class OrdenTrabajoController {
    private readonly ordenTrabajoService;
    constructor(ordenTrabajoService: OrdenTrabajoService);
    create(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<import("./interface/orden-trabajo-con-horas.interface").OrdenTrabajoConHoras>;
    obtenerOrdenesPorMesYAnio(mes: string, anio: string): Promise<OrdenTrabajo[]>;
    findForEmpleado(empleadoId: string): Promise<any>;
    getOrdenesByEmpleadoAndDate(empleadoId: number, mes: number, anio: number): Promise<any>;
    findForServicio(servicioId: string): Promise<any>;
    getOrdenesByServicioAndDate(servicioId: number, mes: number, anio: number): Promise<any>;
    obtenerHorasPorMes(mes: number, anio: number): Promise<any>;
    update(id: string, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    remove(id: string): Promise<void>;
    deleteLogico(id: number): Promise<void>;
}
