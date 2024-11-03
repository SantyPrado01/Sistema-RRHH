"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdenTrabajoModule = void 0;
const common_1 = require("@nestjs/common");
const ordenTrabajo_service_1 = require("./ordenTrabajo.service");
const ordenTrabajo_controller_1 = require("./ordenTrabajo.controller");
const typeorm_1 = require("@nestjs/typeorm");
const ordenTrabajo_entity_1 = require("./entities/ordenTrabajo.entity");
const empleado_entity_1 = require("../empleados/entities/empleado.entity");
const servicio_entity_1 = require("../servicios/entities/servicio.entity");
const horariosAsignados_entity_1 = require("../horariosAsignados/entities/horariosAsignados.entity");
const necesidadHoraria_entity_1 = require("../necesidadHoraria/entities/necesidadHoraria.entity");
let OrdenTrabajoModule = class OrdenTrabajoModule {
};
exports.OrdenTrabajoModule = OrdenTrabajoModule;
exports.OrdenTrabajoModule = OrdenTrabajoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([ordenTrabajo_entity_1.OrdenTrabajo, empleado_entity_1.Empleado, servicio_entity_1.Servicio, horariosAsignados_entity_1.HorarioAsignado, necesidadHoraria_entity_1.NecesidadHoraria])],
        controllers: [ordenTrabajo_controller_1.OrdenTrabajoController],
        providers: [ordenTrabajo_service_1.OrdenTrabajoService],
        exports: [ordenTrabajo_service_1.OrdenTrabajoService]
    })
], OrdenTrabajoModule);
//# sourceMappingURL=ordenTrabajo.module.js.map