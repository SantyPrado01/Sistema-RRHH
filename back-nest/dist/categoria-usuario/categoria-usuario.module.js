"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaUsuarioModule = void 0;
const common_1 = require("@nestjs/common");
const categoria_usuario_service_1 = require("./categoria-usuario.service");
const categoria_usuario_controller_1 = require("./categoria-usuario.controller");
const typeorm_1 = require("@nestjs/typeorm");
const categoria_usuario_entity_1 = require("./entities/categoria-usuario.entity");
let CategoriaUsuarioModule = class CategoriaUsuarioModule {
};
exports.CategoriaUsuarioModule = CategoriaUsuarioModule;
exports.CategoriaUsuarioModule = CategoriaUsuarioModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([categoria_usuario_entity_1.CategoriaUsuario])],
        controllers: [categoria_usuario_controller_1.CategoriaUsuarioController],
        providers: [categoria_usuario_service_1.CategoriaUsuarioService],
    })
], CategoriaUsuarioModule);
//# sourceMappingURL=categoria-usuario.module.js.map