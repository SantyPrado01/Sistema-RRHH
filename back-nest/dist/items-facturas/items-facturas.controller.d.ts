import { ItemsFacturasService } from './items-facturas.service';
import { CreateItemsFacturaDto } from './dto/create-items-factura.dto';
import { UpdateItemsFacturaDto } from './dto/update-items-factura.dto';
export declare class ItemsFacturasController {
    private readonly itemsFacturasService;
    constructor(itemsFacturasService: ItemsFacturasService);
    create(createItemsFacturaDto: CreateItemsFacturaDto): Promise<{
        message: string;
        item: import("./entities/items-factura.entity").ItemsFactura;
    }>;
    findAll(): Promise<import("./entities/items-factura.entity").ItemsFactura[]>;
    findOne(id: string): Promise<import("./entities/items-factura.entity").ItemsFactura>;
    update(id: string, updateItemsFacturaDto: UpdateItemsFacturaDto): Promise<{
        message: string;
        item: import("./entities/items-factura.entity").ItemsFactura & UpdateItemsFacturaDto;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
