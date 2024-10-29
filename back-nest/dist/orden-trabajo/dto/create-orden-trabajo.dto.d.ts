import { CreateHorariosAsignadoDto } from "src/horarios-asignados/dto/create-horarios-asignado.dto";
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
export declare class CreateOrdenTrabajoDto {
    servicio: Servicio;
    empleadoAsignado: Empleado;
    horariosAsignados?: CreateHorariosAsignadoDto[];
    mes: number;
    anio: number;
    dias: string[];
    horaInicio: string;
    horaFin: string;
}
