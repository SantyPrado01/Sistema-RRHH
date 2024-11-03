import { HttpException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';
export declare class EmpleadosService {
    private empleadoRepository;
    constructor(empleadoRepository: Repository<Empleado>);
    create(Empleado: CreateEmpleadoDto): HttpException;
    get(): Promise<Empleado[]>;
    getId(id: number): Promise<HttpException | Empleado>;
    delete(empleadoId: number): Promise<HttpException>;
    update(empleadoId: number, empleado: UpdateEmpleadoDto): Promise<HttpException | (Empleado & UpdateEmpleadoDto)>;
}
