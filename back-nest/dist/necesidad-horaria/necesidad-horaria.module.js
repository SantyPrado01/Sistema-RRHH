"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NecesidadHorariaModule = void 0;
const common_1 = require("@nestjs/common");
const necesidad_horaria_service_1 = require("./necesidad-horaria.service");
const necesidad_horaria_controller_1 = require("./necesidad-horaria.controller");
const necesidad_horaria_entity_1 = require("./entities/necesidad-horaria.entity");
const typeorm_1 = require("@nestjs/typeorm");
let NecesidadHorariaModule = class NecesidadHorariaModule {
};
exports.NecesidadHorariaModule = NecesidadHorariaModule;
exports.NecesidadHorariaModule = NecesidadHorariaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([necesidad_horaria_entity_1.NecesidadHoraria])],
        controllers: [necesidad_horaria_controller_1.NecesidadHorariaController],
        providers: [necesidad_horaria_service_1.NecesidadHorariaService],
    })
], NecesidadHorariaModule);
//# sourceMappingURL=necesidad-horaria.module.js.map