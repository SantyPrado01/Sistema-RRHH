import { IsNotEmpty, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CreateDisponibilidadHorariaDto {
    @IsNotEmpty()
    @IsNumber()
    empleadoId: number;

    @IsOptional()
    diaSemana: number;

    @IsOptional()
    horaInicio: string;

    @IsOptional()
    horaFin: string;

    @IsOptional()
    fechaInicio?: string;

    @IsOptional()
    fechaFin?: string;

    @IsBoolean()
    fullTime: boolean;
}