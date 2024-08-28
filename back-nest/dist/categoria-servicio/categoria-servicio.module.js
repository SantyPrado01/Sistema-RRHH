"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaServicioModule = void 0;
const common_1 = require("@nestjs/common");
const categoria_servicio_service_1 = require("./categoria-servicio.service");
const categoria_servicio_controller_1 = require("./categoria-servicio.controller");
const categoria_servicio_entity_1 = require("./entities/categoria-servicio.entity");
const typeorm_1 = require("@nestjs/typeorm");
let CategoriaServicioModule = class CategoriaServicioModule {
};
exports.CategoriaServicioModule = CategoriaServicioModule;
exports.CategoriaServicioModule = CategoriaServicioModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([categoria_servicio_entity_1.CategoriaServicio])],
        controllers: [categoria_servicio_controller_1.CategoriaServicioController],
        providers: [categoria_servicio_service_1.CategoriaServicioService],
    })
], CategoriaServicioModule);
//# sourceMappingURL=categoria-servicio.module.js.map