import { CreateDisponibilidadHorariaDto } from './create-disponibilidad-horaria.dto';
declare const UpdateDisponibilidadHorariaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateDisponibilidadHorariaDto>>;
export declare class UpdateDisponibilidadHorariaDto extends UpdateDisponibilidadHorariaDto_base {
    empleadoID?: number;
    diaSemana?: number;
    horaInicio?: string;
    horaFin?: string;
    fehcaInicio?: string;
    fechaFin?: string;
}
export {};
