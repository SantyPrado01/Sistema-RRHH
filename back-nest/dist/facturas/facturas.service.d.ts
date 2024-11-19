import { HttpException } from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { Factura } from './entities/factura.entity';
import { Repository } from 'typeorm';
export declare class FacturasService {
    private facturaRepository;
    constructor(facturaRepository: Repository<Factura>);
    createFactura(Factura: CreateFacturaDto): HttpException;
    getFacturas(): Promise<Factura[]>;
    getFactura(facturaId: number): Promise<HttpException | Factura>;
    updateFactura(facturaId: number, factura: UpdateFacturaDto): Promise<HttpException | (Factura & UpdateFacturaDto)>;
    deleteFactura(facturaId: number): Promise<HttpException>;
    update(id: number, updateFacturaDto: UpdateFacturaDto): string;
    remove(id: number): string;
}
