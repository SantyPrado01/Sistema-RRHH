import { Empleado } from "src/empleados/entities/empleado.entity";

export class CreateHorariosAsignadoDto {
    horarioAsignadoId: number; 
 
    ordenTrabajoId?: number;

    empleadoAsignadoId: number;

    empleadoSuplente?: Empleado; 

    fecha: String; 

    horaInicioProyectado: string;

    horaFinProyectado: string; // Hora de fin proyectado

    horaInicioReal?: string; // Hora de inicio real (opcional)

    horaFinReal?: string; // Hora de fin real (opcional)

    estado?: string;
    
    estadoSuplente?: string;// Estado del horario asignado (opcional)

    suplente?: boolean;

    comprobado: boolean

    observaciones?: string

}