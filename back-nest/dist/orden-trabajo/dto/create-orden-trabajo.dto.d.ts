import { CreateHorariosAsignadoDto } from "src/horarios-asignados/dto/create-horarios-asignado.dto";
export declare class CreateOrdenTrabajoDto {
    servicioId: number;
    empleadoAsignadoId: number;
    horariosAsignados: CreateHorariosAsignadoDto[];
    mes: number;
    anio: number;
    dias: string[];
    horarioInicio: string;
    horarioFin: string;
}
