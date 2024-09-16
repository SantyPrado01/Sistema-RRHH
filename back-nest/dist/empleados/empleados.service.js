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
exports.EmpleadosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const empleado_entity_1 = require("./entities/empleado.entity");
const typeorm_2 = require("typeorm");
let EmpleadosService = class EmpleadosService {
    constructor(empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }
    createEmpleado(Empleado) {
        console.log(Empleado);
        const newEmpleado = this.empleadoRepository.create(Empleado);
        return this.empleadoRepository.save(newEmpleado), new common_1.HttpException('El Empleado se guardo con exito', common_1.HttpStatus.ACCEPTED);
    }
    getEmpleados() {
        return this.empleadoRepository.find({
            where: {
                eliminado: false
            }
        });
    }
    async getEmpleado(empleadoId) {
        const empleadoFound = await this.empleadoRepository.findOne({
            where: {
                empleadoId
            }
        });
        if (!empleadoFound) {
            return new common_1.HttpException('Empleado no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return empleadoFound;
    }
    async deleteEmpleado(empleadoId) {
        const empleadoFound = await this.empleadoRepository.findOne({
            where: {
                empleadoId
            }
        });
        if (!empleadoFound) {
            return new common_1.HttpException('Empleado no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        empleadoFound.eliminado = true;
        await this.empleadoRepository.save(empleadoFound);
        throw new common_1.HttpException('Empleado eliminado.', common_1.HttpStatus.ACCEPTED);
    }
    async updateEmpleado(empleadoId, empleado) {
        const empleadoFound = await this.empleadoRepository.findOne({
            where: {
                empleadoId
            }
        });
        if (!empleadoFound) {
            return new common_1.HttpException('Empleado no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const updateEmpleado = Object.assign(empleadoFound, empleado);
        return this.empleadoRepository.save(updateEmpleado);
    }
};
exports.EmpleadosService = EmpleadosService;
exports.EmpleadosService = EmpleadosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(empleado_entity_1.Empleado)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], EmpleadosService);
//# sourceMappingURL=empleados.service.js.map