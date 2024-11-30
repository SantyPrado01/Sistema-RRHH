"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FacturasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const factura_entity_1 = require("./entities/factura.entity");
const common_2 = require("@nestjs/common");
const items_factura_entity_1 = require("../items-facturas/entities/items-factura.entity");
let FacturasService = class FacturasService {
    constructor(facturaRepository, itemsFacturaRepository) {
        this.facturaRepository = facturaRepository;
        this.itemsFacturaRepository = itemsFacturaRepository;
    }
    async createFactura(createFacturaDto) {
        const factura = this.facturaRepository.create(createFacturaDto);
        const savedFactura = await this.facturaRepository.save(factura);
        const itemsFactura = [];
        for (const item of createFacturaDto.items) {
            const existingItem = await this.itemsFacturaRepository.findOne({
                where: {
                    descripcion: item.descripcion,
                    valor: item.valor,
                    facturaId: savedFactura.facturaId,
                },
            });
            let newItem;
            if (existingItem) {
                newItem = existingItem;
            }
            else {
                newItem = this.itemsFacturaRepository.create(item);
            }
            newItem.facturaId = savedFactura.facturaId;
            itemsFactura.push(newItem);
        }
        await this.itemsFacturaRepository.save(itemsFactura);
        savedFactura.items = itemsFactura;
        return savedFactura;
    }
    async findAll() {
        try {
            const facturas = await this.facturaRepository.find({
                relations: ['items', 'servicio'],
            });
            return facturas;
        }
        catch (error) {
            throw new common_2.HttpException('Error al obtener las facturas', common_2.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(facturaId) {
        try {
            const factura = await this.facturaRepository.findOne({
                where: { facturaId },
                relations: ['items', 'servicio'],
            });
            if (!factura) {
                throw new common_2.HttpException('Factura no encontrada', common_2.HttpStatus.NOT_FOUND);
            }
            return factura;
        }
        catch (error) {
            throw new common_2.HttpException('Error al obtener la factura', common_2.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findByServicioId(servicioId) {
        try {
            const facturas = await this.facturaRepository.find({
                where: {
                    servicio: { servicioId },
                },
                relations: ['items', 'servicio'],
            });
            if (facturas.length === 0) {
                throw new common_2.HttpException('No se encontraron facturas para este servicio', common_2.HttpStatus.NOT_FOUND);
            }
            return facturas;
        }
        catch (error) {
            throw new common_2.HttpException('Error al obtener las facturas', common_2.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateFactura(facturaId, updateFacturaDto) {
        const facturaFound = await this.facturaRepository.findOne({
            where: { facturaId },
            relations: ['items', 'servicio'],
        });
        if (!facturaFound) {
            throw new common_2.HttpException('Factura no encontrada.', common_2.HttpStatus.NOT_FOUND);
        }
        const updatedFactura = Object.assign(facturaFound, updateFacturaDto);
        if (updateFacturaDto.items && updateFacturaDto.items.length > 0) {
            const itemsToUpdate = updateFacturaDto.items.map(item => {
                const existingItem = facturaFound.items.find(existingItem => existingItem.id === item.id);
                if (existingItem) {
                    existingItem.descripcion = item.descripcion;
                    existingItem.valor = item.valor;
                    return existingItem;
                }
                else {
                    const newItem = this.itemsFacturaRepository.create({
                        ...item,
                        facturaId: facturaFound.facturaId,
                    });
                    return newItem;
                }
            });
            await this.itemsFacturaRepository.save(itemsToUpdate);
        }
        const savedFactura = await this.facturaRepository.save(updatedFactura);
        return savedFactura;
    }
    async deleteFactura(facturaId) {
        const factura = await this.facturaRepository.findOne({
            where: { facturaId },
        });
        if (!factura) {
            throw new common_2.HttpException('Factura no encontrada', common_2.HttpStatus.NOT_FOUND);
        }
        factura.eliminado = true;
        await this.facturaRepository.save(factura);
        return { message: 'Factura marcada como eliminada con éxito' };
    }
};
exports.FacturasService = FacturasService;
exports.FacturasService = FacturasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(factura_entity_1.Factura)),
    __param(1, (0, typeorm_1.InjectRepository)(items_factura_entity_1.ItemsFactura)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], FacturasService);
//# sourceMappingURL=facturas.service.js.map