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
const factura_entity_1 = require("./entities/factura.entity");
const typeorm_2 = require("typeorm");
let FacturasService = class FacturasService {
    constructor(facturaRepository) {
        this.facturaRepository = facturaRepository;
    }
    createFactura(Factura) {
        const newFactura = this.facturaRepository.create(Factura);
        return this.facturaRepository.save(newFactura),
            new common_1.HttpException('La factura se guardo con exito.', common_1.HttpStatus.ACCEPTED);
    }
    getFacturas() {
        return this.facturaRepository.find({
            where: {
                eliminado: false
            }
        });
    }
    async getFactura(facturaId) {
        const facturaFound = await this.facturaRepository.findOne({
            where: {
                facturaId
            }
        });
        if (!facturaFound) {
            return new common_1.HttpException('Factura no encontrada.', common_1.HttpStatus.NOT_FOUND);
        }
        return facturaFound;
    }
    async updateFactura(facturaId, factura) {
        const facturaFound = await this.facturaRepository.findOne({
            where: {
                facturaId
            }
        });
        if (!facturaFound) {
            return new common_1.HttpException('Factura no Encontrada.', common_1.HttpStatus.NOT_FOUND);
        }
        const updateFactura = Object.assign(facturaFound, factura);
        return this.facturaRepository.save(updateFactura);
    }
    async deleteFactura(facturaId) {
        const facturaFound = await this.facturaRepository.findOne({
            where: {
                facturaId
            }
        });
        if (!facturaFound) {
            return new common_1.HttpException('Factura no encontrada.', common_1.HttpStatus.ACCEPTED);
        }
        facturaFound.eliminado = true;
        await this.facturaRepository.save(facturaFound);
        throw new common_1.HttpException('Factura Eliminada.', common_1.HttpStatus.ACCEPTED);
    }
    update(id, updateFacturaDto) {
        return `This action updates a #${id} factura`;
    }
    remove(id) {
        return `This action removes a #${id} factura`;
    }
};
exports.FacturasService = FacturasService;
exports.FacturasService = FacturasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(factura_entity_1.Factura)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], FacturasService);
//# sourceMappingURL=facturas.service.js.map