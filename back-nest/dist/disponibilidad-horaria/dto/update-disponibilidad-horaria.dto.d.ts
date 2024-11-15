import { CreateDisponibilidadHorariaDto } from './create-disponibilidad-horaria.dto';
declare const UpdateDisponibilidadHorariaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateDisponibilidadHorariaDto>>;
export declare class UpdateDisponibilidadHorariaDto extends UpdateDisponibilidadHorariaDto_base {
    empleadoId?: number;
    diaSemana?: number;
    horaInicio?: string;
    horaFin?: string;
}
export {};
