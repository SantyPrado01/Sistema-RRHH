import { CreateHorariosAsignadoDto } from "src/horarios-asignados/dto/create-horarios-asignado.dto";
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { CreateNecesidadHorariaDto } from 'src/necesidad-horaria/dto/create-necesidad-horaria.dto';
export declare class CreateOrdenTrabajoDto {
    servicio: Servicio;
    empleadoAsignado: Empleado;
    horariosAsignados?: CreateHorariosAsignadoDto[];
    necesidadHoraria?: CreateNecesidadHorariaDto[];
    mes: number;
    anio: number;
}
