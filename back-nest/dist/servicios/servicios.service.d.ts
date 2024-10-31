import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
export declare class ServiciosService {
    private servicioRepository;
    constructor(servicioRepository: Repository<Servicio>);
    createServicio(servicio: CreateServicioDto): Promise<Servicio>;
    getServicios(): Promise<Servicio[]>;
    getServicio(nombre: string): Promise<Servicio | null>;
    getServicioId(id: number): Promise<Servicio>;
    deleteServicio(servicioId: number): Promise<void>;
    updateServicio(servicioId: number, servicio: UpdateServicioDto): Promise<Servicio & UpdateServicioDto>;
}
