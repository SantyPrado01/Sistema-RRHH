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
exports.HorariosAsignadosController = void 0;
const common_1 = require("@nestjs/common");
const horariosAsignados_service_1 = require("./horariosAsignados.service");
const createHorariosAsignados_dto_1 = require("./dto/createHorariosAsignados.dto");
const updateHorariosAsignados_entity_1 = require("./dto/updateHorariosAsignados.entity");
let HorariosAsignadosController = class HorariosAsignadosController {
    constructor(horariosAsignadosService) {
        this.horariosAsignadosService = horariosAsignadosService;
    }
    create(createHorariosDto) {
        return this.horariosAsignadosService.create(createHorariosDto);
    }
    async getHorariosAsignados() {
        return this.horariosAsignadosService.getHorariosAsignados();
    }
    findAll() {
        return this.horariosAsignadosService.findAll();
    }
    findOne(id) {
        return this.horariosAsignadosService.findOne(+id);
    }
    update(id, updateHorariosAsignadoDto) {
        return this.horariosAsignadosService.update(+id, updateHorariosAsignadoDto);
    }
    remove(id) {
        return this.horariosAsignadosService.remove(+id);
    }
};
exports.HorariosAsignadosController = HorariosAsignadosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createHorariosAsignados_dto_1.CreateHorariosAsignadoDto]),
    __metadata("design:returntype", void 0)
], HorariosAsignadosController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HorariosAsignadosController.prototype, "getHorariosAsignados", null);
__decorate([
    (0, common_1.Get)('/all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HorariosAsignadosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HorariosAsignadosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateHorariosAsignados_entity_1.UpdateHorariosAsignadoDto]),
    __metadata("design:returntype", void 0)
], HorariosAsignadosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HorariosAsignadosController.prototype, "remove", null);
exports.HorariosAsignadosController = HorariosAsignadosController = __decorate([
    (0, common_1.Controller)('horariosAsignados'),
    __metadata("design:paramtypes", [horariosAsignados_service_1.HorarioAsignadoService])
], HorariosAsignadosController);
//# sourceMappingURL=horariosAsignados.controller.js.map