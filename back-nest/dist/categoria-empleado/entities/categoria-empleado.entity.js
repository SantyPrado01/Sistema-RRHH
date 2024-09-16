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
exports.CategoriaEmpleado = void 0;
const empleado_entity_1 = require("../../empleados/entities/empleado.entity");
const typeorm_1 = require("typeorm");
let CategoriaEmpleado = class CategoriaEmpleado {
};
exports.CategoriaEmpleado = CategoriaEmpleado;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], CategoriaEmpleado.prototype, "categoriaEmpleadoId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CategoriaEmpleado.prototype, "categoriaEmpleadoNombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CategoriaEmpleado.prototype, "eliminado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => empleado_entity_1.Empleado, empleado => empleado.categoria),
    __metadata("design:type", empleado_entity_1.Empleado)
], CategoriaEmpleado.prototype, "empleados", void 0);
exports.CategoriaEmpleado = CategoriaEmpleado = __decorate([
    (0, typeorm_1.Entity)({
        name: 'categoriaEmpleado'
    })
], CategoriaEmpleado);
//# sourceMappingURL=categoria-empleado.entity.js.map