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
exports.Empleado = void 0;
const typeorm_1 = require("typeorm");
const disponibilidad_horaria_entity_1 = require("../../disponibilidad-horaria/entities/disponibilidad-horaria.entity");
const categoria_empleado_entity_1 = require("../../categoria-empleado/entities/categoria-empleado.entity");
let Empleado = class Empleado {
};
exports.Empleado = Empleado;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'int',
        name: 'id'
    }),
    __metadata("design:type", Number)
], Empleado.prototype, "empleadoId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Empleado.prototype, "legajo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'empleadoNombre' }),
    __metadata("design:type", String)
], Empleado.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Empleado.prototype, "apellido", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Empleado.prototype, "nroDocumento", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Empleado.prototype, "telefono", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Empleado.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], Empleado.prototype, "fechaIngreso", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Empleado.prototype, "eliminado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Empleado.prototype, "ciudad", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Empleado.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => categoria_empleado_entity_1.CategoriaEmpleado, categoria => categoria.empleados, { eager: true }),
    (0, typeorm_1.JoinTable)({ name: "categoria" }),
    __metadata("design:type", categoria_empleado_entity_1.CategoriaEmpleado)
], Empleado.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => disponibilidad_horaria_entity_1.DisponibilidadHoraria, disponibilidad => disponibilidad.empleado, { eager: true }),
    (0, typeorm_1.JoinTable)({ name: 'disponibilidad' }),
    __metadata("design:type", disponibilidad_horaria_entity_1.DisponibilidadHoraria)
], Empleado.prototype, "disponibilidad", void 0);
exports.Empleado = Empleado = __decorate([
    (0, typeorm_1.Entity)({
        name: 'Empleados'
    })
], Empleado);
//# sourceMappingURL=empleado.entity.js.map