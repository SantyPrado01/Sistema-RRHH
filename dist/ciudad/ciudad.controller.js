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
exports.CiudadController = void 0;
const common_1 = require("@nestjs/common");
const ciudad_service_1 = require("./ciudad.service");
const create_ciudad_dto_1 = require("./dto/create-ciudad.dto");
const update_ciudad_dto_1 = require("./dto/update-ciudad.dto");
let CiudadController = class CiudadController {
    constructor(ciudadService) {
        this.ciudadService = ciudadService;
    }
    create(createCiudadDto) {
        return this.ciudadService.createCiudad(createCiudadDto);
    }
    findAll() {
        return this.ciudadService.getCiudades();
    }
    findOne(id) {
        return this.ciudadService.getCiudad(id);
    }
    update(id, updateCiudadDto) {
        return this.ciudadService.updateCiudad(+id, updateCiudadDto);
    }
    remove(id) {
        return this.ciudadService.deleteCiudad(id);
    }
};
exports.CiudadController = CiudadController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_ciudad_dto_1.CreateCiudadDto]),
    __metadata("design:returntype", void 0)
], CiudadController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CiudadController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CiudadController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_ciudad_dto_1.UpdateCiudadDto]),
    __metadata("design:returntype", void 0)
], CiudadController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CiudadController.prototype, "remove", null);
exports.CiudadController = CiudadController = __decorate([
    (0, common_1.Controller)('ciudad'),
    __metadata("design:paramtypes", [ciudad_service_1.CiudadService])
], CiudadController);
//# sourceMappingURL=ciudad.controller.js.map