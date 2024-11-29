import { HttpException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';
import { CreateDisponibilidadHorariaDto } from 'src/disponibilidad-horaria/dto/create-disponibilidad-horaria.dto';
import { DisponibilidadHoraria } from 'src/disponibilidad-horaria/entities/disponibilidad-horaria.entity';
import { UpdateDisponibilidadHorariaDto } from 'src/disponibilidad-horaria/dto/update-disponibilidad-horaria.dto';
export declare class EmpleadosService {
    private empleadoRepository;
    private readonly disponibilidadRepository;
    constructor(empleadoRepository: Repository<Empleado>, disponibilidadRepository: Repository<DisponibilidadHoraria>);
    createEmpleado(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado>;
    createDisponibilidad(empleadoId: number, createDisponibilidadHorariaDto: CreateDisponibilidadHorariaDto[]): Promise<DisponibilidadHoraria[]>;
    get(): Promise<Empleado[]>;
    getId(id: number): Promise<Empleado | HttpException>;
    delete(empleadoId: number): Promise<HttpException>;
    update(empleadoId: number, empleado: UpdateEmpleadoDto): Promise<HttpException | (Empleado & UpdateEmpleadoDto)>;
    updateDisponibilidad(empleadoId: number, updateDisponibilidadDto: UpdateDisponibilidadHorariaDto[]): Promise<any>;
}
