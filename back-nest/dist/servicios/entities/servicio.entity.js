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
exports.Servicio = void 0;
const categoria_servicio_entity_1 = require("../../categoria-servicio/entities/categoria-servicio.entity");
const factura_entity_1 = require("../../facturas/entities/factura.entity");
const necesidad_horaria_entity_1 = require("../../necesidad-horaria/entities/necesidad-horaria.entity");
const typeorm_1 = require("typeorm");
let Servicio = class Servicio {
};
exports.Servicio = Servicio;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Servicio.prototype, "servicioId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Servicio.prototype, "servicioNombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Servicio.prototype, "CUIT", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Servicio.prototype, "direccion", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Servicio.prototype, "ciudad", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Servicio.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_servicio_entity_1.CategoriaServicio, categoria => categoria.servicios),
    __metadata("design:type", Array)
], Servicio.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Servicio.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Servicio.prototype, "elimindado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => necesidad_horaria_entity_1.NecesidadHoraria, necesidad => necesidad.servicio),
    __metadata("design:type", Array)
], Servicio.prototype, "necesidades", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => factura_entity_1.Factura, factura => factura.servicio),
    __metadata("design:type", Array)
], Servicio.prototype, "facturas", void 0);
exports.Servicio = Servicio = __decorate([
    (0, typeorm_1.Entity)({
        name: 'Servicios'
    })
], Servicio);
//# sourceMappingURL=servicio.entity.js.map