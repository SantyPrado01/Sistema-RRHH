import { CreateItemsFacturaDto } from './dto/create-items-factura.dto';
import { UpdateItemsFacturaDto } from './dto/update-items-factura.dto';
import { ItemsFactura } from './entities/items-factura.entity';
import { Repository } from 'typeorm';
export declare class ItemsFacturasService {
    private readonly itemsFacturaRepository;
    constructor(itemsFacturaRepository: Repository<ItemsFactura>);
    create(createItemsFacturaDto: CreateItemsFacturaDto): Promise<{
        message: string;
        item: ItemsFactura;
    }>;
    findAll(): Promise<ItemsFactura[]>;
    findOne(id: number): Promise<ItemsFactura>;
    update(id: number, updateItemsFacturaDto: UpdateItemsFacturaDto): Promise<{
        message: string;
        item: ItemsFactura & UpdateItemsFacturaDto;
    }>;
    remove(id: number): Promise<{
        message: string;
    }>;
}
