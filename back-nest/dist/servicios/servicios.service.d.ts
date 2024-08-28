import { HttpException } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
export declare class ServiciosService {
    private servicioRepository;
    constructor(servicioRepository: Repository<Servicio>);
    createServicio(servicio: CreateServicioDto): Promise<HttpException>;
    getServicios(): Promise<Servicio[]>;
    getServicio(servicioNombre: string): Promise<Servicio>;
    getServicioId(servicioId: number): Promise<HttpException | Servicio>;
    deleteServicio(servicioId: number): Promise<HttpException>;
    updateServicio(servicioId: number, servicio: UpdateServicioDto): Promise<HttpException | Servicio>;
}
