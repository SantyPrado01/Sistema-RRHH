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
const orden_trabajo_service_1 = require("./orden-trabajo.service");
const orden_trabajo_controller_1 = require("./orden-trabajo.controller");
const typeorm_1 = require("@nestjs/typeorm");
const orden_trabajo_entity_1 = require("./entities/orden-trabajo.entity");
let OrdenTrabajoModule = class OrdenTrabajoModule {
};
exports.OrdenTrabajoModule = OrdenTrabajoModule;
exports.OrdenTrabajoModule = OrdenTrabajoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([orden_trabajo_entity_1.OrdenTrabajo])],
        controllers: [orden_trabajo_controller_1.OrdenTrabajoController],
        providers: [orden_trabajo_service_1.OrdenTrabajoService],
    })
], OrdenTrabajoModule);
//# sourceMappingURL=orden-trabajo.module.js.map