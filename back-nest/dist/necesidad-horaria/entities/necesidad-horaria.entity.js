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
exports.NecesidadHoraria = void 0;
const servicio_entity_1 = require("../../servicios/entities/servicio.entity");
const typeorm_1 = require("typeorm");
let NecesidadHoraria = class NecesidadHoraria {
};
exports.NecesidadHoraria = NecesidadHoraria;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], NecesidadHoraria.prototype, "necesidadHorariaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => servicio_entity_1.Servicio, servicio => servicio.necesidades),
    (0, typeorm_1.JoinColumn)({ name: 'servicio_id' }),
    __metadata("design:type", servicio_entity_1.Servicio)
], NecesidadHoraria.prototype, "servicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'tinyint' }),
    __metadata("design:type", Number)
], NecesidadHoraria.prototype, "diaSemana", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], NecesidadHoraria.prototype, "horaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], NecesidadHoraria.prototype, "horaFin", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], NecesidadHoraria.prototype, "fechaInicio", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], NecesidadHoraria.prototype, "fechaFin", void 0);
exports.NecesidadHoraria = NecesidadHoraria = __decorate([
    (0, typeorm_1.Entity)({
        name: 'necesidadHoraria'
    })
], NecesidadHoraria);
//# sourceMappingURL=necesidad-horaria.entity.js.map