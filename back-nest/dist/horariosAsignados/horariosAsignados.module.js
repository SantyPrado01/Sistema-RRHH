"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorariosAsignadosModule = void 0;
const common_1 = require("@nestjs/common");
const horariosAsignados_service_1 = require("./horariosAsignados.service");
const horariosAsignados_controller_1 = require("./horariosAsignados.controller");
const horariosAsignados_entity_1 = require("./entities/horariosAsignados.entity");
const typeorm_1 = require("@nestjs/typeorm");
const ordenTrabajo_entity_1 = require("../ordenTrabajo/entities/ordenTrabajo.entity");
const empleado_entity_1 = require("../empleados/entities/empleado.entity");
let HorariosAsignadosModule = class HorariosAsignadosModule {
};
exports.HorariosAsignadosModule = HorariosAsignadosModule;
exports.HorariosAsignadosModule = HorariosAsignadosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([horariosAsignados_entity_1.HorarioAsignado, ordenTrabajo_entity_1.OrdenTrabajo, empleado_entity_1.Empleado])],
        controllers: [horariosAsignados_controller_1.HorariosAsignadosController],
        providers: [horariosAsignados_service_1.HorarioAsignadoService],
    })
], HorariosAsignadosModule);
//# sourceMappingURL=horariosAsignados.module.js.map