import { OrdenTrabajoService } from './orden-trabajo.service';
import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/update-orden-trabajo.dto';
export declare class OrdenTrabajoController {
    private readonly ordenTrabajoService;
    constructor(ordenTrabajoService: OrdenTrabajoService);
    create(createOrdenTrabajoDto: CreateOrdenTrabajoDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto): string;
    remove(id: string): string;
}
