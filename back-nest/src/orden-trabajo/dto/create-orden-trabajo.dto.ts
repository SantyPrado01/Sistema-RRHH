import { IsNotEmpty, IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHorariosAsignadoDto } from "src/horarios-asignados/dto/create-horarios-asignado.dto";

export class CreateOrdenTrabajoDto {
    @IsNotEmpty()
    @IsNumber()
    servicioId: number;

    @IsNotEmpty()
    @IsNumber()
    empleadoAsignadoId: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateHorariosAsignadoDto)
    horariosAsignados: CreateHorariosAsignadoDto[]; // Cambiado a un array

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
    horarioInicio: string;

    @IsNotEmpty()
    @IsString()
    horarioFin: string;
}
