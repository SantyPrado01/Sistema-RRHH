import { CiudadService } from './ciudad.service';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
export declare class CiudadController {
    private readonly ciudadService;
    constructor(ciudadService: CiudadService);
    create(createCiudadDto: CreateCiudadDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateCiudadDto: UpdateCiudadDto): string;
    remove(id: string): string;
}
