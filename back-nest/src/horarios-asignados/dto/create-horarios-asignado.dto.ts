import { IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Empleado } from "src/empleados/entities/empleado.entity";
import { OrdenTrabajo } from "src/orden-trabajo/entities/orden-trabajo.entity";
import { PrimaryGeneratedColumn } from "typeorm";

export class CreateHorariosAsignadoDto {
    @PrimaryGeneratedColumn()
    horarioAsignadoId: number; 
 
    ordenTrabajoId: number;// ID de la orden de trabajo

    empleadoAsignadoId: number;// ID del empleado asignado

    @IsOptional()
    empleadoSuplente?: Empleado; // ID del empleado suplente (opcional)

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
