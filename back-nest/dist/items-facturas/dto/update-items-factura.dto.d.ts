import { CreateItemsFacturaDto } from './create-items-factura.dto';
declare const UpdateItemsFacturaDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateItemsFacturaDto>>;
export declare class UpdateItemsFacturaDto extends UpdateItemsFacturaDto_base {
    id?: number;
    descripcion?: string;
    valor?: number;
    facturaId?: number;
}
export {};
