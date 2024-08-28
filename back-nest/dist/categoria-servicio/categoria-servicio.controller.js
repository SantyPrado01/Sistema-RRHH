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
exports.CategoriaServicioController = void 0;
const common_1 = require("@nestjs/common");
const categoria_servicio_service_1 = require("./categoria-servicio.service");
const create_categoria_servicio_dto_1 = require("./dto/create-categoria-servicio.dto");
const update_categoria_servicio_dto_1 = require("./dto/update-categoria-servicio.dto");
let CategoriaServicioController = class CategoriaServicioController {
    constructor(categoriaServicioService) {
        this.categoriaServicioService = categoriaServicioService;
    }
    create(createCategoriaServicioDto) {
        return this.categoriaServicioService.createCategoriaServicio(createCategoriaServicioDto);
    }
    findAll() {
        return this.categoriaServicioService.getCategoriasServicios();
    }
    findOne(id) {
        return this.categoriaServicioService.getCategoriaServicioId(+id);
    }
    update(id, updateCategoriaServicioDto) {
        return this.categoriaServicioService.updateCategoriaServicio(+id, updateCategoriaServicioDto);
    }
    remove(id) {
        return this.categoriaServicioService.deleteCategoriaServicio(+id);
    }
};
exports.CategoriaServicioController = CategoriaServicioController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_categoria_servicio_dto_1.CreateCategoriaServicioDto]),
    __metadata("design:returntype", void 0)
], CategoriaServicioController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CategoriaServicioController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriaServicioController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_categoria_servicio_dto_1.UpdateCategoriaServicioDto]),
    __metadata("design:returntype", void 0)
], CategoriaServicioController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CategoriaServicioController.prototype, "remove", null);
exports.CategoriaServicioController = CategoriaServicioController = __decorate([
    (0, common_1.Controller)('categoria-servicio'),
    __metadata("design:paramtypes", [categoria_servicio_service_1.CategoriaServicioService])
], CategoriaServicioController);
//# sourceMappingURL=categoria-servicio.controller.js.map