"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolUsuarioModule = void 0;
const common_1 = require("@nestjs/common");
const rol_usuario_service_1 = require("./rol-usuario.service");
const rol_usuario_controller_1 = require("./rol-usuario.controller");
let RolUsuarioModule = class RolUsuarioModule {
};
exports.RolUsuarioModule = RolUsuarioModule;
exports.RolUsuarioModule = RolUsuarioModule = __decorate([
    (0, common_1.Module)({
        controllers: [rol_usuario_controller_1.RolUsuarioController],
        providers: [rol_usuario_service_1.RolUsuarioService],
    })
], RolUsuarioModule);
//# sourceMappingURL=rol-usuario.module.js.map