import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
export declare class EmpleadosController {
    private readonly empleadosService;
    constructor(empleadosService: EmpleadosService);
    createEmpleado(createEmpleadoDto: CreateEmpleadoDto): import("@nestjs/common").HttpException;
    getEmpleados(): Promise<import("./entities/empleado.entity").Empleado[]>;
    getEmpleado(id: string): Promise<import("@nestjs/common").HttpException | import("./entities/empleado.entity").Empleado>;
    updateEmpleado(id: string, updateEmpleadoDto: UpdateEmpleadoDto): Promise<import("@nestjs/common").HttpException | (import("./entities/empleado.entity").Empleado & UpdateEmpleadoDto)>;
    deleteEmpleado(id: string): Promise<import("@nestjs/common").HttpException>;
}
