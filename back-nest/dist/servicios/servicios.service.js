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
exports.ServiciosService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const servicio_entity_1 = require("./entities/servicio.entity");
let ServiciosService = class ServiciosService {
    constructor(servicioRepository) {
        this.servicioRepository = servicioRepository;
    }
    async createServicio(servicio) {
        const servicioFound = await this.servicioRepository.findOne({
            where: {
                nombre: servicio.nombre
            }
        });
        if (servicioFound) {
            return new common_1.HttpException('El servicio ya existe. Prueba nuevamente.', common_1.HttpStatus.CONFLICT);
        }
        const newServicio = this.servicioRepository.create(servicio);
        return this.servicioRepository.save(newServicio), new common_1.HttpException('El Servicio se guardo con exito.', common_1.HttpStatus.ACCEPTED);
    }
    getServicios() {
        return this.servicioRepository.find({
            where: {
                elimindado: false
            }
        });
    }
    async getServicio(nombre) {
        const servicioFound = await this.servicioRepository.findOne({
            where: {
                nombre
            }
        });
        if (!nombre) {
            return null;
        }
        return servicioFound;
    }
    async getServicioId(servicioId) {
        const servicioFound = await this.servicioRepository.findOne({
            where: {
                servicioId
            }
        });
        if (!servicioFound) {
            return new common_1.HttpException('Servicio no encontrado.', common_1.HttpStatus.NOT_FOUND);
        }
        return servicioFound;
    }
    async deleteServicio(servicioId) {
        const servicioFound = await this.servicioRepository.findOne({
            where: {
                servicioId
            }
        });
        if (!servicioFound) {
            return new common_1.HttpException('Servicio no encontrado.', common_1.HttpStatus.NOT_FOUND);
        }
        servicioFound.elimindado = true;
        await this.servicioRepository.save(servicioFound);
        throw new common_1.HttpException('Servicio Eliminado', common_1.HttpStatus.ACCEPTED);
    }
    async updateServicio(servicioId, servicio) {
        const servicioFound = this.servicioRepository.findOne({
            where: {
                servicioId
            }
        });
        if (!servicioFound) {
            return new common_1.HttpException('Servicio no encontrado.', common_1.HttpStatus.NOT_FOUND);
        }
        const updateServicio = Object.assign(servicioFound, servicio);
        return this.servicioRepository.save(updateServicio);
    }
};
exports.ServiciosService = ServiciosService;
exports.ServiciosService = ServiciosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(servicio_entity_1.Servicio)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ServiciosService);
//# sourceMappingURL=servicios.service.js.map