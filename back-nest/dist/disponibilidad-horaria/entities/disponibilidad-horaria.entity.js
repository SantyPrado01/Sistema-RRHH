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
exports.DisponibilidadHoraria = void 0;
const empleado_entity_1 = require("../../empleados/entities/empleado.entity");
const typeorm_1 = require("typeorm");
let DisponibilidadHoraria = class DisponibilidadHoraria {
};
exports.DisponibilidadHoraria = DisponibilidadHoraria;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], DisponibilidadHoraria.prototype, "disponibilidadHorariaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado, empleado => empleado.disponibilidad),
    (0, typeorm_1.JoinColumn)({ name: 'empleado_id' }),
    __metadata("design:type", empleado_entity_1.Empleado)
], DisponibilidadHoraria.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint' }),
    __metadata("design:type", Number)
], DisponibilidadHoraria.prototype, "diaSemana", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], DisponibilidadHoraria.prototype, "horaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], DisponibilidadHoraria.prototype, "horaFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], DisponibilidadHoraria.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], DisponibilidadHoraria.prototype, "fechaFin", void 0);
exports.DisponibilidadHoraria = DisponibilidadHoraria = __decorate([
    (0, typeorm_1.Entity)({
        name: 'disponibilidadHoraria'
    })
], DisponibilidadHoraria);
//# sourceMappingURL=disponibilidad-horaria.entity.js.map