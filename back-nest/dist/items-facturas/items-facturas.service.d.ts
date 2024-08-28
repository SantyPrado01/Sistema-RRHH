import { CreateItemsFacturaDto } from './dto/create-items-factura.dto';
import { UpdateItemsFacturaDto } from './dto/update-items-factura.dto';
export declare class ItemsFacturasService {
    create(createItemsFacturaDto: CreateItemsFacturaDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateItemsFacturaDto: UpdateItemsFacturaDto): string;
    remove(id: number): string;
}
