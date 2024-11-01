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
exports.OrdenTrabajoController = void 0;
const common_1 = require("@nestjs/common");
const orden_trabajo_service_1 = require("./orden-trabajo.service");
const create_orden_trabajo_dto_1 = require("./dto/create-orden-trabajo.dto");
const update_orden_trabajo_dto_1 = require("./dto/update-orden-trabajo.dto");
let OrdenTrabajoController = class OrdenTrabajoController {
    constructor(ordenTrabajoService) {
        this.ordenTrabajoService = ordenTrabajoService;
    }
    async create(createOrdenTrabajoDto) {
        const ordenTrabajo = await this.ordenTrabajoService.create(createOrdenTrabajoDto);
        if (!ordenTrabajo)
            throw new common_1.NotFoundException('No se pudo crear la orden de trabajo');
        const ordenTrabajoId = ordenTrabajo.ordenTrabajoId;
        await this.ordenTrabajoService.addNecesidadHoraria(ordenTrabajoId, createOrdenTrabajoDto.necesidadHoraria.map(necesidad => ({
            ordenTrabajoId,
            diaSemana: necesidad.diaSemana,
            horaInicio: necesidad.horaInicio,
            horaFin: necesidad.horaFin,
        })));
        await this.ordenTrabajoService.asignarHorarios(ordenTrabajoId);
        return this.ordenTrabajoService.findOne(ordenTrabajoId);
    }
    findAll() {
        return this.ordenTrabajoService.findAll();
    }
    findOne(id) {
        return this.ordenTrabajoService.findOne(+id);
    }
    update(id, updateOrdenTrabajoDto) {
        return this.ordenTrabajoService.update(+id, updateOrdenTrabajoDto);
    }
    remove(id) {
        return this.ordenTrabajoService.remove(+id);
    }
};
exports.OrdenTrabajoController = OrdenTrabajoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_orden_trabajo_dto_1.CreateOrdenTrabajoDto]),
    __metadata("design:returntype", Promise)
], OrdenTrabajoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdenTrabajoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdenTrabajoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_orden_trabajo_dto_1.UpdateOrdenTrabajoDto]),
    __metadata("design:returntype", void 0)
], OrdenTrabajoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdenTrabajoController.prototype, "remove", null);
exports.OrdenTrabajoController = OrdenTrabajoController = __decorate([
    (0, common_1.Controller)('ordenTrabajo'),
    __metadata("design:paramtypes", [orden_trabajo_service_1.OrdenTrabajoService])
], OrdenTrabajoController);
//# sourceMappingURL=orden-trabajo.controller.js.map