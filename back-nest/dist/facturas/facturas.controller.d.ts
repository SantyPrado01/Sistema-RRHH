import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
export declare class FacturasController {
    private readonly facturasService;
    constructor(facturasService: FacturasService);
    create(createFacturaDto: CreateFacturaDto): Promise<import("./entities/factura.entity").Factura>;
    findAll(): Promise<import("./entities/factura.entity").Factura[]>;
    findOne(id: string): Promise<import("./entities/factura.entity").Factura>;
    findFacturasByServicio(servicioId: number): Promise<import("./entities/factura.entity").Factura[]>;
    update(id: string, updateFacturaDto: UpdateFacturaDto): Promise<import("./entities/factura.entity").Factura & UpdateFacturaDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
