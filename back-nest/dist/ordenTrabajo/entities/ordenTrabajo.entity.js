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
exports.OrdenTrabajo = void 0;
const empleado_entity_1 = require("../../empleados/entities/empleado.entity");
const horariosAsignados_entity_1 = require("../../horariosAsignados/entities/horariosAsignados.entity");
const necesidadHoraria_entity_1 = require("../../necesidadHoraria/entities/necesidadHoraria.entity");
const servicio_entity_1 = require("../../servicios/entities/servicio.entity");
const typeorm_1 = require("typeorm");
let OrdenTrabajo = class OrdenTrabajo {
};
exports.OrdenTrabajo = OrdenTrabajo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], OrdenTrabajo.prototype, "Id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => servicio_entity_1.Servicio, (servicio) => servicio.ordenesTrabajo),
    __metadata("design:type", servicio_entity_1.Servicio)
], OrdenTrabajo.prototype, "servicio", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => empleado_entity_1.Empleado, { nullable: false }),
    __metadata("design:type", empleado_entity_1.Empleado)
], OrdenTrabajo.prototype, "empleadoAsignado", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => horariosAsignados_entity_1.HorarioAsignado, (horario) => horario.ordenTrabajo),
    __metadata("design:type", Array)
], OrdenTrabajo.prototype, "horariosAsignados", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrdenTrabajo.prototype, "mes", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], OrdenTrabajo.prototype, "anio", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => necesidadHoraria_entity_1.NecesidadHoraria, (necesidades) => necesidades.ordenTrabajo, { eager: true }),
    __metadata("design:type", Array)
], OrdenTrabajo.prototype, "necesidadHoraria", void 0);
exports.OrdenTrabajo = OrdenTrabajo = __decorate([
    (0, typeorm_1.Entity)('ordenes-trabajo')
], OrdenTrabajo);
//# sourceMappingURL=ordenTrabajo.entity.js.map