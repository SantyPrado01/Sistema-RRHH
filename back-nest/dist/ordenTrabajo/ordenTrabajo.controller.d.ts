import { OrdenTrabajoService } from './ordenTrabajo.service';
import { CreateOrdenTrabajoDto } from './dto/createOrdenTrabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/updateOrdenTrabajo.dto';
import { OrdenTrabajo } from './entities/ordenTrabajo.entity';
export declare class OrdenTrabajoController {
    private readonly ordenTrabajoService;
    constructor(ordenTrabajoService: OrdenTrabajoService);
    create(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    findAll(): Promise<OrdenTrabajo[]>;
    findOne(id: string): Promise<import("./interface/orden-trabajo-con-horas.interface").OrdenTrabajoConHoras>;
    obtenerOrdenesPorMesYAnio(mes: string, anio: string, completado: boolean): Promise<OrdenTrabajo[]>;
    findForEmpleado(mes: string, anio: string, completado: string, empleadoId: string): Promise<any>;
    findForServicio(mes: string, anio: string, completado: string, servicioId: string): Promise<any>;
    obtenerHorasPorMes(mes: number, anio: number, completado: boolean): Promise<any>;
    update(id: string, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    remove(id: string): Promise<void>;
}
