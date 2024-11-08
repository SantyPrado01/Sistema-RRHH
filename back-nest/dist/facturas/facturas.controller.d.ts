import { FacturasService } from './facturas.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
export declare class FacturasController {
    private readonly facturasService;
    constructor(facturasService: FacturasService);
    create(createFacturaDto: CreateFacturaDto): import("@nestjs/common").HttpException;
    findAll(): Promise<import("./entities/factura.entity").Factura[]>;
    findOne(id: string): Promise<import("./entities/factura.entity").Factura | import("@nestjs/common").HttpException>;
    update(id: string, updateFacturaDto: UpdateFacturaDto): string;
    remove(id: string): string;
}
