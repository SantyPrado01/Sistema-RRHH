"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaEmpleadoModule = void 0;
const common_1 = require("@nestjs/common");
const categoria_empleado_service_1 = require("./categoria-empleado.service");
const categoria_empleado_controller_1 = require("./categoria-empleado.controller");
const categoria_empleado_entity_1 = require("./entities/categoria-empleado.entity");
const typeorm_1 = require("@nestjs/typeorm");
let CategoriaEmpleadoModule = class CategoriaEmpleadoModule {
};
exports.CategoriaEmpleadoModule = CategoriaEmpleadoModule;
exports.CategoriaEmpleadoModule = CategoriaEmpleadoModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([categoria_empleado_entity_1.CategoriaEmpleado])],
        controllers: [categoria_empleado_controller_1.CategoriaEmpleadoController],
        providers: [categoria_empleado_service_1.CategoriaEmpleadoService],
    })
], CategoriaEmpleadoModule);
//# sourceMappingURL=categoria-empleado.module.js.map