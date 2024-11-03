import { OrdenTrabajoService } from './ordenTrabajo.service';
import { CreateOrdenTrabajoDto } from './dto/createOrdenTrabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/updateOrdenTrabajo.dto';
import { OrdenTrabajo } from './entities/ordenTrabajo.entity';
export declare class OrdenTrabajoController {
    private readonly ordenTrabajoService;
    constructor(ordenTrabajoService: OrdenTrabajoService);
    create(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    findAll(): Promise<OrdenTrabajo[]>;
    findOne(id: string): Promise<OrdenTrabajo>;
    update(id: string, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    remove(id: string): Promise<void>;
}
