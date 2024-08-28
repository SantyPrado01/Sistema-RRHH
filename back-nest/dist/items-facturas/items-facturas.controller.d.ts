import { ItemsFacturasService } from './items-facturas.service';
import { CreateItemsFacturaDto } from './dto/create-items-factura.dto';
import { UpdateItemsFacturaDto } from './dto/update-items-factura.dto';
export declare class ItemsFacturasController {
    private readonly itemsFacturasService;
    constructor(itemsFacturasService: ItemsFacturasService);
    create(createItemsFacturaDto: CreateItemsFacturaDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateItemsFacturaDto: UpdateItemsFacturaDto): string;
    remove(id: string): string;
}
