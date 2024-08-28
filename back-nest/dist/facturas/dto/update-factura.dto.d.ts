import { CreateFacturaDto } from './create-factura.dto';
declare const UpdateFacturaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateFacturaDto>>;
export declare class UpdateFacturaDto extends UpdateFacturaDto_base {
    numero?: number;
    fecha?: Date;
    total?: number;
    servicioId?: number;
    itemsFacturaId?: number;
}
export {};
