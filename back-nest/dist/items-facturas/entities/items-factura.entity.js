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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsFactura = void 0;
const factura_entity_1 = require("../../facturas/entities/factura.entity");
const typeorm_1 = require("typeorm");
let ItemsFactura = class ItemsFactura {
};
exports.ItemsFactura = ItemsFactura;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ItemsFactura.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ItemsFactura.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], ItemsFactura.prototype, "valor", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => factura_entity_1.Factura, factura => factura.items, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'factura_id' }),
    __metadata("design:type", factura_entity_1.Factura)
], ItemsFactura.prototype, "factura", void 0);
exports.ItemsFactura = ItemsFactura = __decorate([
    (0, typeorm_1.Entity)({
        name: 'ItemsFactura'
    })
], ItemsFactura);
//# sourceMappingURL=items-factura.entity.js.map