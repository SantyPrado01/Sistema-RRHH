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
exports.Categorias = void 0;
const servicio_entity_1 = require("../../servicios/entities/servicio.entity");
const empleado_entity_1 = require("../../empleados/entities/empleado.entity");
const typeorm_1 = require("typeorm");
let Categorias = class Categorias {
};
exports.Categorias = Categorias;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Categorias.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Categorias.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Categorias.prototype, "eliminado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => empleado_entity_1.Empleado, empleado => empleado.categoria),
    __metadata("design:type", empleado_entity_1.Empleado)
], Categorias.prototype, "empleados", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => servicio_entity_1.Servicio, servicio => servicio.categoria),
    __metadata("design:type", empleado_entity_1.Empleado)
], Categorias.prototype, "servicios", void 0);
exports.Categorias = Categorias = __decorate([
    (0, typeorm_1.Entity)({ name: 'categoria' })
], Categorias);
//# sourceMappingURL=categoria-empleado.entity.js.map