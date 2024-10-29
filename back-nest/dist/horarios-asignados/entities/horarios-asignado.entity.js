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
exports.HorarioAsignado = void 0;
const empleado_entity_1 = require("../../empleados/entities/empleado.entity");
const orden_trabajo_entity_1 = require("../../orden-trabajo/entities/orden-trabajo.entity");
const typeorm_1 = require("typeorm");
let HorarioAsignado = class HorarioAsignado {
};
exports.HorarioAsignado = HorarioAsignado;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], HorarioAsignado.prototype, "horarioAsignadoId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => orden_trabajo_entity_1.OrdenTrabajo, (orden) => orden.horariosAsignados, { nullable: false }),
    __metadata("design:type", orden_trabajo_entity_1.OrdenTrabajo)
], HorarioAsignado.prototype, "ordenTrabajo", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado, { nullable: false }),
    __metadata("design:type", empleado_entity_1.Empleado)
], HorarioAsignado.prototype, "empleado", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado, { nullable: true }),
    __metadata("design:type", empleado_entity_1.Empleado)
], HorarioAsignado.prototype, "empleadoSuplente", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], HorarioAsignado.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HorarioAsignado.prototype, "horaInicioProyectado", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HorarioAsignado.prototype, "horaFinProyectado", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HorarioAsignado.prototype, "horaInicioReal", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], HorarioAsignado.prototype, "horaFinReal", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], HorarioAsignado.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], HorarioAsignado.prototype, "suplente", void 0);
exports.HorarioAsignado = HorarioAsignado = __decorate([
    (0, typeorm_1.Entity)('horarios_asignados')
], HorarioAsignado);
//# sourceMappingURL=horarios-asignado.entity.js.map