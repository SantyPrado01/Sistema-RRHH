import { Repository } from 'typeorm';
import { Factura } from './entities/factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { ItemsFactura } from 'src/items-facturas/entities/items-factura.entity';
export declare class FacturasService {
    private readonly facturaRepository;
    private readonly itemsFacturaRepository;
    constructor(facturaRepository: Repository<Factura>, itemsFacturaRepository: Repository<ItemsFactura>);
    createFactura(createFacturaDto: CreateFacturaDto): Promise<Factura>;
    findAll(): Promise<Factura[]>;
    findOne(facturaId: number): Promise<Factura>;
    updateFactura(facturaId: number, updateFacturaDto: UpdateFacturaDto): Promise<Factura & UpdateFacturaDto>;
    deleteFactura(facturaId: number): Promise<{
        message: string;
    }>;
}
