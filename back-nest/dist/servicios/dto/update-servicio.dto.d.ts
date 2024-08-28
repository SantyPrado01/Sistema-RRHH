import { CreateServicioDto } from './create-servicio.dto';
declare const UpdateServicioDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateServicioDto>>;
export declare class UpdateServicioDto extends UpdateServicioDto_base {
    nombre?: string;
    CUIT?: number;
    direccion?: string;
    ciudadID?: number;
    telefono?: number;
    categoriaID?: number;
    descripcion?: string;
    eliminado?: boolean;
    necesidadHorariaID?: number;
}
export {};
