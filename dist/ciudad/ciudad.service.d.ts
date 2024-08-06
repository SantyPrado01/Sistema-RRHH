import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
export declare class CiudadService {
    create(createCiudadDto: CreateCiudadDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCiudadDto: UpdateCiudadDto): string;
    remove(id: number): string;
}
