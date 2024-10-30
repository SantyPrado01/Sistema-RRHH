import { IsNotEmpty, IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHorariosAsignadoDto } from "src/horarios-asignados/dto/create-horarios-asignado.dto";
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { CreateNecesidadHorariaDto } from 'src/necesidad-horaria/dto/create-necesidad-horaria.dto';

export class CreateOrdenTrabajoDto {

    @IsNotEmpty()
    servicio: Servicio ;

    @IsNotEmpty()
    empleadoAsignado: Empleado;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateHorariosAsignadoDto)
    horariosAsignados?: CreateHorariosAsignadoDto[]; // Cambiado a un array

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateNecesidadHorariaDto)
    necesidadHoraria?: CreateNecesidadHorariaDto[]

    @IsNotEmpty()
    @IsNumber()
    mes: number;

    @IsNotEmpty()
    @IsNumber()
    anio: number;

}
