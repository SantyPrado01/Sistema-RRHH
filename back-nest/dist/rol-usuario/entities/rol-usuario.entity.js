"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolUsuario = void 0;
const user_entity_1 = require("../../users/user.entity");
const typeorm_1 = require("typeorm");
let RolUsuario = class RolUsuario {
};
exports.RolUsuario = RolUsuario;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({
        type: 'int',
        name: 'id'
    }),
    __metadata("design:type", Number)
], RolUsuario.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], RolUsuario.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, user => user.rol),
    __metadata("design:type", Array)
], RolUsuario.prototype, "usuarios", void 0);
exports.RolUsuario = RolUsuario = __decorate([
    (0, typeorm_1.Entity)({
        name: 'rolUsuario'
    })
], RolUsuario);
//# sourceMappingURL=rol-usuario.entity.js.map