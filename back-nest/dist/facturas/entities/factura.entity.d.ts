import { ItemsFactura } from "../../items-facturas/entities/items-factura.entity";
import { Servicio } from "../../servicios/entities/servicio.entity";
export declare class Factura {
    facturaId: number;
    numero: number;
    fecha: Date;
    total: number;
    eliminado: boolean;
    servicio: Servicio;
    items: ItemsFactura[];
}
