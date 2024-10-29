import { OrdenTrabajoService } from './orden-trabajo.service';
import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/update-orden-trabajo.dto';
export declare class OrdenTrabajoController {
    private readonly ordenTrabajoService;
    constructor(ordenTrabajoService: OrdenTrabajoService);
    create(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<import("./entities/orden-trabajo.entity").OrdenTrabajo>;
    findAll(): Promise<import("./entities/orden-trabajo.entity").OrdenTrabajo[]>;
    findOne(id: string): Promise<import("./entities/orden-trabajo.entity").OrdenTrabajo>;
    update(id: string, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto): Promise<import("./entities/orden-trabajo.entity").OrdenTrabajo>;
    remove(id: string): Promise<void>;
}
