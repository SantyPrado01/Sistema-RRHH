import { CreateItemsFacturaDto } from "src/items-facturas/dto/create-items-factura.dto";
export declare class CreateFacturaDto {
    facturaId: number;
    numero: number;
    fecha: Date;
    total: number;
    servicioId: number;
    eliminado: boolean;
    items: CreateItemsFacturaDto[];
}
