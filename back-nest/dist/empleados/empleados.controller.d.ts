import { HttpException } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
export declare class EmpleadosController {
    private readonly empleadosService;
    constructor(empleadosService: EmpleadosService);
    create(createEmpleadoDto: CreateEmpleadoDto): Promise<any>;
    getEmpleados(): Promise<import("./entities/empleado.entity").Empleado[]>;
    getEmpleadosEliminado(): Promise<import("./entities/empleado.entity").Empleado[]>;
    getEmpleado(id: string): Promise<import("./entities/empleado.entity").Empleado | HttpException>;
    updateEmpleado(id: number, updateEmpleadoDto: UpdateEmpleadoDto): Promise<any>;
    deleteEmpleado(id: string): Promise<HttpException>;
}
