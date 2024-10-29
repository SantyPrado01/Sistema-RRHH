import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { HttpService } from '@nestjs/axios';
export declare class EmpleadosController {
    private readonly empleadosService;
    private readonly httpService;
    constructor(empleadosService: EmpleadosService, httpService: HttpService);
    createEmpleado(createEmpleadoDto: CreateEmpleadoDto): import("@nestjs/common").HttpException;
    getEmpleados(): Promise<import("./entities/empleado.entity").Empleado[]>;
    getEmpleado(id: string): Promise<import("@nestjs/common").HttpException | import("./entities/empleado.entity").Empleado>;
    updateEmpleado(id: string, updateEmpleadoDto: UpdateEmpleadoDto): Promise<import("@nestjs/common").HttpException | (import("./entities/empleado.entity").Empleado & UpdateEmpleadoDto)>;
    deleteEmpleado(id: string): Promise<import("@nestjs/common").HttpException>;
}
