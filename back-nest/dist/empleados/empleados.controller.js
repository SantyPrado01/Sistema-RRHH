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
exports.EmpleadosController = void 0;
const common_1 = require("@nestjs/common");
const empleados_service_1 = require("./empleados.service");
const create_empleado_dto_1 = require("./dto/create-empleado.dto");
const update_empleado_dto_1 = require("./dto/update-empleado.dto");
const axios_1 = require("@nestjs/axios");
let EmpleadosController = class EmpleadosController {
    constructor(empleadosService, httpService) {
        this.empleadosService = empleadosService;
        this.httpService = httpService;
    }
    createEmpleado(createEmpleadoDto) {
        return this.empleadosService.createEmpleado(createEmpleadoDto);
    }
    getEmpleados() {
        return this.empleadosService.getEmpleados();
    }
    getEmpleado(id) {
        return this.empleadosService.getEmpleado(+id);
    }
    updateEmpleado(id, updateEmpleadoDto) {
        return this.empleadosService.updateEmpleado(+id, updateEmpleadoDto);
    }
    deleteEmpleado(id) {
        return this.empleadosService.deleteEmpleado(+id);
    }
};
exports.EmpleadosController = EmpleadosController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_empleado_dto_1.CreateEmpleadoDto]),
    __metadata("design:returntype", void 0)
], EmpleadosController.prototype, "createEmpleado", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EmpleadosController.prototype, "getEmpleados", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmpleadosController.prototype, "getEmpleado", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_empleado_dto_1.UpdateEmpleadoDto]),
    __metadata("design:returntype", void 0)
], EmpleadosController.prototype, "updateEmpleado", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EmpleadosController.prototype, "deleteEmpleado", null);
exports.EmpleadosController = EmpleadosController = __decorate([
    (0, common_1.Controller)('empleados'),
    __metadata("design:paramtypes", [empleados_service_1.EmpleadosService,
        axios_1.HttpService])
], EmpleadosController);
//# sourceMappingURL=empleados.controller.js.map