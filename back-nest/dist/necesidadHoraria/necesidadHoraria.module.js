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
const necesidadHoraria_service_1 = require("./necesidadHoraria.service");
const necesidadHoraria_controller_1 = require("./necesidadHoraria.controller");
const necesidadHoraria_entity_1 = require("./entities/necesidadHoraria.entity");
const typeorm_1 = require("@nestjs/typeorm");
const ordenTrabajo_entity_1 = require("../ordenTrabajo/entities/ordenTrabajo.entity");
const ordenTrabajo_module_1 = require("../ordenTrabajo/ordenTrabajo.module");
let NecesidadHorariaModule = class NecesidadHorariaModule {
};
exports.NecesidadHorariaModule = NecesidadHorariaModule;
exports.NecesidadHorariaModule = NecesidadHorariaModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([necesidadHoraria_entity_1.NecesidadHoraria, ordenTrabajo_entity_1.OrdenTrabajo]), ordenTrabajo_module_1.OrdenTrabajoModule],
        controllers: [necesidadHoraria_controller_1.NecesidadHorariaController],
        providers: [necesidadHoraria_service_1.NecesidadHorariaService],
    })
], NecesidadHorariaModule);
//# sourceMappingURL=necesidadHoraria.module.js.map