import { CreateCiudadDto } from './create-ciudad.dto';
declare const UpdateCiudadDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateCiudadDto>>;
export declare class UpdateCiudadDto extends UpdateCiudadDto_base {
    nombre?: string;
}
export {};
