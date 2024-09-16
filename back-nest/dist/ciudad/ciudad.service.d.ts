import { HttpException } from '@nestjs/common';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { Ciudad } from './entities/ciudad.entity';
import { Repository } from 'typeorm';
export declare class CiudadService {
    private ciudadRepository;
    constructor(ciudadRepository: Repository<Ciudad>);
    createCiudad(ciudad: CreateCiudadDto): Promise<HttpException | {
        message: string;
        ciudad: Ciudad;
    }>;
    getCiudades(): Promise<Ciudad[]>;
    getCiudad(nombreCiudad: string): Promise<Ciudad>;
    getCiudadId(idCiudad: number): Promise<HttpException | Ciudad>;
    deleteCiudad(idCiudad: number): Promise<HttpException>;
    updateCiudad(idCiudad: number, ciudad: UpdateCiudadDto): Promise<HttpException | (Ciudad & UpdateCiudadDto)>;
}
