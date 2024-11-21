import { CreateHorariosAsignadoDto } from 'src/horariosAsignados/dto/createHorariosAsignados.dto';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { CreateNecesidadHorariaDto } from 'src/necesidadHoraria/dto/createNecesidadHoraria.dto';
export declare class CreateOrdenTrabajoDto {
    servicio: Servicio;
    empleadoAsignado: Empleado;
    horariosAsignados?: CreateHorariosAsignadoDto[];
    necesidadHoraria?: CreateNecesidadHorariaDto[];
    mes?: number;
    anio?: number;
    diaEspecifico?: Date;
    horaInicio?: string;
    horaFin?: string;
}
