import { CiudadService } from './ciudad.service';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
export declare class CiudadController {
    private readonly ciudadService;
    constructor(ciudadService: CiudadService);
    create(createCiudadDto: CreateCiudadDto): Promise<import("@nestjs/common").HttpException | {
        message: string;
        ciudad: import("./entities/ciudad.entity").Ciudad;
    }>;
    findAll(): Promise<import("./entities/ciudad.entity").Ciudad[]>;
    findOne(id: string): Promise<import("./entities/ciudad.entity").Ciudad>;
    update(id: number, updateCiudadDto: UpdateCiudadDto): Promise<import("@nestjs/common").HttpException | (import("./entities/ciudad.entity").Ciudad & UpdateCiudadDto)>;
    remove(id: number): Promise<import("@nestjs/common").HttpException>;
}
