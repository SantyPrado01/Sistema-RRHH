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
exports.NecesidadHorariaController = void 0;
const common_1 = require("@nestjs/common");
const necesidad_horaria_service_1 = require("./necesidad-horaria.service");
const create_necesidad_horaria_dto_1 = require("./dto/create-necesidad-horaria.dto");
const update_necesidad_horaria_dto_1 = require("./dto/update-necesidad-horaria.dto");
let NecesidadHorariaController = class NecesidadHorariaController {
    constructor(necesidadHorariaService) {
        this.necesidadHorariaService = necesidadHorariaService;
    }
    create(createNecesidadHorariaDto) {
        return this.necesidadHorariaService.create(createNecesidadHorariaDto);
    }
    findAll() {
        return this.necesidadHorariaService.findAll();
    }
    findOne(id) {
        return this.necesidadHorariaService.findOne(+id);
    }
    update(id, updateNecesidadHorariaDto) {
        return this.necesidadHorariaService.update(+id, updateNecesidadHorariaDto);
    }
    remove(id) {
        return this.necesidadHorariaService.remove(+id);
    }
};
exports.NecesidadHorariaController = NecesidadHorariaController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_necesidad_horaria_dto_1.CreateNecesidadHorariaDto]),
    __metadata("design:returntype", void 0)
], NecesidadHorariaController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], NecesidadHorariaController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NecesidadHorariaController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_necesidad_horaria_dto_1.UpdateNecesidadHorariaDto]),
    __metadata("design:returntype", void 0)
], NecesidadHorariaController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NecesidadHorariaController.prototype, "remove", null);
exports.NecesidadHorariaController = NecesidadHorariaController = __decorate([
    (0, common_1.Controller)('necesidad-horaria'),
    __metadata("design:paramtypes", [necesidad_horaria_service_1.NecesidadHorariaService])
], NecesidadHorariaController);
//# sourceMappingURL=necesidad-horaria.controller.js.map