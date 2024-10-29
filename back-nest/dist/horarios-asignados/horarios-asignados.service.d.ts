import { CreateHorariosAsignadoDto } from './dto/create-horarios-asignado.dto';
import { UpdateHorariosAsignadoDto } from './dto/update-horarios-asignado.dto';
export declare class HorariosAsignadosService {
    create(createHorariosAsignadoDto: CreateHorariosAsignadoDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateHorariosAsignadoDto: UpdateHorariosAsignadoDto): string;
    remove(id: number): string;
}
