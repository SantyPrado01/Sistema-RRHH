import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
export declare class ServiciosController {
    private readonly serviciosService;
    constructor(serviciosService: ServiciosService);
    create(createServicioDto: CreateServicioDto): Promise<import("@nestjs/common").HttpException>;
    findAll(): Promise<import("./entities/servicio.entity").Servicio[]>;
    findOne(id: string): Promise<import("@nestjs/common").HttpException | import("./entities/servicio.entity").Servicio>;
    update(id: string, updateServicioDto: UpdateServicioDto): Promise<import("@nestjs/common").HttpException | import("./entities/servicio.entity").Servicio>;
    remove(id: string): Promise<import("@nestjs/common").HttpException>;
}
