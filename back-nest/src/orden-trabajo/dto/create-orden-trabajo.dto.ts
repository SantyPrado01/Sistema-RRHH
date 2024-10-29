import { IsNotEmpty, IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHorariosAsignadoDto } from "src/horarios-asignados/dto/create-horarios-asignado.dto";
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';

export class CreateOrdenTrabajoDto {

    @IsNotEmpty()
    servicio: Servicio ;

    @IsNotEmpty()
    empleadoAsignado: Empleado;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateHorariosAsignadoDto)
    horariosAsignados?: CreateHorariosAsignadoDto[]; // Cambiado a un array

    @IsNotEmpty()
    @IsNumber()
    mes: number;

    @IsNotEmpty()
    @IsNumber()
    anio: number;

    @IsArray()
    @IsNotEmpty()
    dias: string[];

    @IsNotEmpty()
    @IsString()
    horaInicio: string;

    @IsNotEmpty()
    @IsString()
    horaFin: string;
}
