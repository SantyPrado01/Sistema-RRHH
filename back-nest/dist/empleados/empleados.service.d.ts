import { HttpException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';
export declare class EmpleadosService {
    private empleadoRepository;
    constructor(empleadoRepository: Repository<Empleado>);
    createEmpleado(Empleado: CreateEmpleadoDto): HttpException;
    getEmpleados(): Promise<Empleado[]>;
    getEmpleado(id: number): Promise<HttpException | Empleado>;
    deleteEmpleado(empleadoId: number): Promise<HttpException>;
    updateEmpleado(empleadoId: number, empleado: UpdateEmpleadoDto): Promise<HttpException | (Empleado & UpdateEmpleadoDto)>;
}
