import { CreateNecesidadHorariaDto } from './createNecesidadHoraria.dto';
declare const UpdateNecesidadHorariaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateNecesidadHorariaDto>>;
export declare class UpdateNecesidadHorariaDto extends UpdateNecesidadHorariaDto_base {
    ordenTrabajoId?: number;
    diaSemana?: number;
    horaInicio?: string;
    horaFin?: string;
}
export {};
