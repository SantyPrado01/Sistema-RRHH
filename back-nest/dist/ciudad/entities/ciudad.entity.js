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
exports.Ciudad = void 0;
const empleado_entity_1 = require("../../empleados/entities/empleado.entity");
const servicio_entity_1 = require("../../servicios/entities/servicio.entity");
const typeorm_1 = require("typeorm");
let Ciudad = class Ciudad {
};
exports.Ciudad = Ciudad;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Ciudad.prototype, "idCiudad", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Ciudad.prototype, "nombreCiudad", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => empleado_entity_1.Empleado, empleados => empleados.ciudad),
    __metadata("design:type", Array)
], Ciudad.prototype, "empleados", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => servicio_entity_1.Servicio, servicios => servicios.ciudad),
    __metadata("design:type", Array)
], Ciudad.prototype, "servicios", void 0);
exports.Ciudad = Ciudad = __decorate([
    (0, typeorm_1.Entity)({
        name: 'ciudad'
    })
], Ciudad);
//# sourceMappingURL=ciudad.entity.js.map