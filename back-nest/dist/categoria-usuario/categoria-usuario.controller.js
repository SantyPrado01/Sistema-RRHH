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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaUsuarioController = void 0;
const common_1 = require("@nestjs/common");
const categoria_usuario_service_1 = require("./categoria-usuario.service");
const create_categoria_usuario_dto_1 = require("./dto/create-categoria-usuario.dto");
const update_categoria_usuario_dto_1 = require("./dto/update-categoria-usuario.dto");
let CategoriaUsuarioController = class CategoriaUsuarioController {
    constructor(categoriaUsuarioService) {
        this.categoriaUsuarioService = categoriaUsuarioService;
    }
    create(createCategoriaUsuarioDto) {
        return this.categoriaUsuarioService.create(createCategoriaUsuarioDto);
    }
    findAll() {
        return this.categoriaUsuarioService.findAll();
    }
    findOne(id) {
        return this.categoriaUsuarioService.findOne(+id);
    }
    update(id, updateCategoriaUsuarioDto) {
        return this.categoriaUsuarioService.update(+id, updateCategoriaUsuarioDto);
    }
    remove(id) {
        return this.categoriaUsuarioService.remove(+id);
    }
};
exports.CategoriaUsuarioController = CategoriaUsuarioController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoria_usuario_dto_1.CreateCategoriaUsuarioDto]),
    __metadata("design:returntype", void 0)
], CategoriaUsuarioController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriaUsuarioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriaUsuarioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_categoria_usuario_dto_1.UpdateCategoriaUsuarioDto]),
    __metadata("design:returntype", void 0)
], CategoriaUsuarioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriaUsuarioController.prototype, "remove", null);
exports.CategoriaUsuarioController = CategoriaUsuarioController = __decorate([
    (0, common_1.Controller)('categoria-usuario'),
    __metadata("design:paramtypes", [categoria_usuario_service_1.CategoriaUsuarioService])
], CategoriaUsuarioController);
//# sourceMappingURL=categoria-usuario.controller.js.map