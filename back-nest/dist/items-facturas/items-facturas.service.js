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
exports.ItemsFacturasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const items_factura_entity_1 = require("./entities/items-factura.entity");
const typeorm_2 = require("typeorm");
let ItemsFacturasService = class ItemsFacturasService {
    constructor(itemsFacturaRepository) {
        this.itemsFacturaRepository = itemsFacturaRepository;
    }
    async create(createItemsFacturaDto) {
        try {
            const newItem = this.itemsFacturaRepository.create(createItemsFacturaDto);
            await this.itemsFacturaRepository.save(newItem);
            return { message: 'Item de factura creado con éxito', item: newItem };
        }
        catch (error) {
            throw new common_1.HttpException('Error al crear el item de factura', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll() {
        try {
            const items = await this.itemsFacturaRepository.find();
            return items;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener los items de factura', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const item = await this.itemsFacturaRepository.findOne({ where: { id } });
            if (!item) {
                throw new common_1.HttpException('Item de factura no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return item;
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener el item de factura', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async update(id, updateItemsFacturaDto) {
        try {
            const item = await this.itemsFacturaRepository.findOne({ where: { id } });
            if (!item) {
                throw new common_1.HttpException('Item de factura no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            const updatedItem = Object.assign(item, updateItemsFacturaDto);
            await this.itemsFacturaRepository.save(updatedItem);
            return { message: 'Item de factura actualizado con éxito', item: updatedItem };
        }
        catch (error) {
            throw new common_1.HttpException('Error al actualizar el item de factura', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            const item = await this.itemsFacturaRepository.findOne({ where: { id } });
            if (!item) {
                throw new common_1.HttpException('Item de factura no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            await this.itemsFacturaRepository.remove(item);
            return { message: 'Item de factura eliminado con éxito' };
        }
        catch (error) {
            throw new common_1.HttpException('Error al eliminar el item de factura', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ItemsFacturasService = ItemsFacturasService;
exports.ItemsFacturasService = ItemsFacturasService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(items_factura_entity_1.ItemsFactura)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ItemsFacturasService);
//# sourceMappingURL=items-facturas.service.js.map