import { CreateDisponibilidadHorariaDto } from './dto/create-disponibilidad-horaria.dto';
import { UpdateDisponibilidadHorariaDto } from './dto/update-disponibilidad-horaria.dto';
export declare class DisponibilidadHorariaService {
    create(createDisponibilidadHorariaDto: CreateDisponibilidadHorariaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateDisponibilidadHorariaDto: UpdateDisponibilidadHorariaDto): string;
    remove(id: number): string;
}
