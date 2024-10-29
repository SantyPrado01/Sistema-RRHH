export declare class CreateHorariosAsignadoDto {
    horarioAsignadoId: number;
    ordenTrabajoId: number;
    empleadoAsignadoId: number;
    empleadoSuplenteId?: number;
    fecha: Date;
    horaInicioProyectado: string;
    horaFinProyectado: string;
    horaInicioReal?: string;
    horaFinReal?: string;
    estado?: string;
    suplente?: boolean;
}
