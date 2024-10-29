import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateHorariosAsignadoDto {
    @IsNotEmpty()
    horarioAsignadoId: number; 
 
    @IsNotEmpty()
    ordenTrabajoId: number; // ID de la orden de trabajo asociada

    @IsNotEmpty()
    empleadoAsignadoId: number; // ID del empleado asignado

    @IsOptional()
    empleadoSuplenteId?: number; // ID del empleado suplente (opcional)

    @IsDateString()
    fecha: Date; // Fecha del horario asignado

    @IsString()
    @IsNotEmpty()
    horaInicioProyectado: string; // Hora de inicio proyectado

    @IsString()
    @IsNotEmpty()
    horaFinProyectado: string; // Hora de fin proyectado

    @IsOptional()
    @IsString()
    horaInicioReal?: string; // Hora de inicio real (opcional)

    @IsOptional()
    @IsString()
    horaFinReal?: string; // Hora de fin real (opcional)

    @IsOptional()
    @IsString()
    estado?: string; // Estado del horario asignado (opcional)

    @IsOptional()
    suplente?: boolean;

}
