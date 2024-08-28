"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisponibilidadHorariaModule = void 0;
const common_1 = require("@nestjs/common");
const disponibilidad_horaria_service_1 = require("./disponibilidad-horaria.service");
const disponibilidad_horaria_controller_1 = require("./disponibilidad-horaria.controller");
const disponibilidad_horaria_entity_1 = require("./entities/disponibilidad-horaria.entity");
const typeorm_1 = require("@nestjs/typeorm");
let DisponibilidadHorariaModule = class DisponibilidadHorariaModule {
};
exports.DisponibilidadHorariaModule = DisponibilidadHorariaModule;
exports.DisponibilidadHorariaModule = DisponibilidadHorariaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([disponibilidad_horaria_entity_1.DisponibilidadHoraria])],
        controllers: [disponibilidad_horaria_controller_1.DisponibilidadHorariaController],
        providers: [disponibilidad_horaria_service_1.DisponibilidadHorariaService],
    })
], DisponibilidadHorariaModule);
//# sourceMappingURL=disponibilidad-horaria.module.js.map