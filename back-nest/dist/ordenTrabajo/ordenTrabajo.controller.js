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
const ordenTrabajo_service_1 = require("./ordenTrabajo.service");
const createOrdenTrabajo_dto_1 = require("./dto/createOrdenTrabajo.dto");
const updateOrdenTrabajo_dto_1 = require("./dto/updateOrdenTrabajo.dto");
let OrdenTrabajoController = class OrdenTrabajoController {
    constructor(ordenTrabajoService) {
        this.ordenTrabajoService = ordenTrabajoService;
    }
    async create(createOrdenTrabajoDto) {
        const ordenTrabajo = await this.ordenTrabajoService.createOrdenTrabajo(createOrdenTrabajoDto);
        if (!ordenTrabajo)
            throw new common_1.NotFoundException('No se pudo crear la orden de trabajo');
        const ordenTrabajoId = ordenTrabajo.Id;
        if (createOrdenTrabajoDto.diaEspecifico) {
            await this.ordenTrabajoService.createAsignarHorarioUnico(ordenTrabajoId, createOrdenTrabajoDto.diaEspecifico, createOrdenTrabajoDto.horaInicio, createOrdenTrabajoDto.horaFin);
        }
        else {
            await this.ordenTrabajoService.createNecesidadHoraria(ordenTrabajoId, createOrdenTrabajoDto.necesidadHoraria.map(necesidad => ({
                ordenTrabajoId,
                diaSemana: necesidad.diaSemana,
                horaInicio: necesidad.horaInicio,
                horaFin: necesidad.horaFin,
            })));
            await this.ordenTrabajoService.createAsignarHorarios(ordenTrabajoId);
        }
        return this.ordenTrabajoService.findOne(ordenTrabajoId);
    }
    findAll() {
        return this.ordenTrabajoService.findAll();
    }
    findOne(id) {
        return this.ordenTrabajoService.findOne(+id);
    }
    async obtenerOrdenesPorMesYAnio(mes, anio) {
        const mesNumero = parseInt(mes, 10);
        const anioNumero = parseInt(anio, 10);
        if (isNaN(mesNumero) || isNaN(anioNumero)) {
            throw new Error('Mes o Año no válidos');
        }
        return this.ordenTrabajoService.findMesAnio(mesNumero, anioNumero);
    }
    async findForEmpleado(empleadoId) {
        const empleadoIdNumero = parseInt(empleadoId, 10);
        if (isNaN(empleadoIdNumero)) {
            throw new Error('Mes, Año o ID de Empleado no válidos');
        }
        return await this.ordenTrabajoService.findForEmpleado(empleadoIdNumero);
    }
    async getOrdenesByEmpleadoAndDate(empleadoId, mes, anio) {
        return await this.ordenTrabajoService.findForEmpleadoByMonthAndYear(empleadoId, mes, anio);
    }
    async findForServicio(servicioId) {
        const servicioIdNumero = parseInt(servicioId, 10);
        if (isNaN(servicioIdNumero)) {
            console.log('Mes:', servicioIdNumero);
            throw new Error('Mes, Año o ID de Empleado no válidos');
        }
        return await this.ordenTrabajoService.findForServicio(servicioIdNumero);
    }
    async getOrdenesByServicioAndDate(servicioId, mes, anio) {
        return await this.ordenTrabajoService.findForServicioByMonthAndYear(servicioId, mes, anio);
    }
    async obtenerHorasPorMes(mes, anio) {
        return await this.ordenTrabajoService.obtenerHorasPorMes(mes, anio);
    }
    update(id, updateOrdenTrabajoDto) {
        return this.ordenTrabajoService.update(+id, updateOrdenTrabajoDto);
    }
    remove(id) {
        return this.ordenTrabajoService.deleteOrdenTrabajo(+id);
    }
};
exports.OrdenTrabajoController = OrdenTrabajoController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createOrdenTrabajo_dto_1.CreateOrdenTrabajoDto]),
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
    (0, common_1.Get)('findByMesAnio/:mes/:anio'),
    __param(0, (0, common_1.Param)('mes')),
    __param(1, (0, common_1.Param)('anio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OrdenTrabajoController.prototype, "obtenerOrdenesPorMesYAnio", null);
__decorate([
    (0, common_1.Get)('findForEmpleado/:empleadoId'),
    __param(0, (0, common_1.Param)('empleadoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdenTrabajoController.prototype, "findForEmpleado", null);
__decorate([
    (0, common_1.Get)('findByMesAnioEmpleado/:empleadoId/:mes/:anio'),
    __param(0, (0, common_1.Param)('empleadoId')),
    __param(1, (0, common_1.Param)('mes')),
    __param(2, (0, common_1.Param)('anio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], OrdenTrabajoController.prototype, "getOrdenesByEmpleadoAndDate", null);
__decorate([
    (0, common_1.Get)('findForServicio/:servicioId'),
    __param(0, (0, common_1.Param)('servicioId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdenTrabajoController.prototype, "findForServicio", null);
__decorate([
    (0, common_1.Get)('findByMesAnioServicio/:servicioId/:mes/:anio'),
    __param(0, (0, common_1.Param)('servicioId')),
    __param(1, (0, common_1.Param)('mes')),
    __param(2, (0, common_1.Param)('anio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", Promise)
], OrdenTrabajoController.prototype, "getOrdenesByServicioAndDate", null);
__decorate([
    (0, common_1.Get)('horas-mes/:mes/:anio'),
    __param(0, (0, common_1.Param)('mes')),
    __param(1, (0, common_1.Param)('anio')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], OrdenTrabajoController.prototype, "obtenerHorasPorMes", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateOrdenTrabajo_dto_1.UpdateOrdenTrabajoDto]),
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
    __metadata("design:paramtypes", [ordenTrabajo_service_1.OrdenTrabajoService])
], OrdenTrabajoController);
//# sourceMappingURL=ordenTrabajo.controller.js.map