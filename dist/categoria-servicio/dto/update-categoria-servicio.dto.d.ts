import { CreateCategoriaServicioDto } from './create-categoria-servicio.dto';
declare const UpdateCategoriaServicioDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCategoriaServicioDto>>;
export declare class UpdateCategoriaServicioDto extends UpdateCategoriaServicioDto_base {
    nombre?: string;
}
export {};
