import { OrdenTrabajoService } from './orden-trabajo.service';
import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/update-orden-trabajo.dto';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
export declare class OrdenTrabajoController {
    private readonly ordenTrabajoService;
    constructor(ordenTrabajoService: OrdenTrabajoService);
    create(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    findAll(): Promise<OrdenTrabajo[]>;
    findOne(id: string): Promise<OrdenTrabajo>;
    update(id: string, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto): Promise<OrdenTrabajo>;
    remove(id: string): Promise<void>;
}
