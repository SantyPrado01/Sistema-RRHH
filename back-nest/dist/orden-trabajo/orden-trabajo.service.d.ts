import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/update-orden-trabajo.dto';
export declare class OrdenTrabajoService {
    create(createOrdenTrabajoDto: CreateOrdenTrabajoDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto): string;
    remove(id: number): string;
}
