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
exports.Factura = void 0;
const items_factura_entity_1 = require("../../items-facturas/entities/items-factura.entity");
const servicio_entity_1 = require("../../servicios/entities/servicio.entity");
const typeorm_1 = require("typeorm");
let Factura = class Factura {
};
exports.Factura = Factura;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'int',
        name: 'id'
    }),
    __metadata("design:type", Number)
], Factura.prototype, "facturaId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Factura.prototype, "numero", void 0);
__decorate([
    (0, typeorm_1.Column)('date'),
    __metadata("design:type", Date)
], Factura.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Factura.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Factura.prototype, "eliminado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => servicio_entity_1.Servicio, servicio => servicio.facturas),
    (0, typeorm_1.JoinColumn)({ name: 'servicioId' }),
    __metadata("design:type", servicio_entity_1.Servicio)
], Factura.prototype, "servicio", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => items_factura_entity_1.ItemsFactura, item => item.factura, { cascade: true }),
    __metadata("design:type", Array)
], Factura.prototype, "items", void 0);
exports.Factura = Factura = __decorate([
    (0, typeorm_1.Entity)({
        name: 'Facturas'
    })
], Factura);
//# sourceMappingURL=factura.entity.js.map