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
exports.CiudadService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ciudad_entity_1 = require("./entities/ciudad.entity");
const typeorm_2 = require("typeorm");
let CiudadService = class CiudadService {
    constructor(ciudadRepository) {
        this.ciudadRepository = ciudadRepository;
    }
    async createCiudad(ciudad) {
        const ciudadFound = await this.ciudadRepository.findOne({
            where: {
                nombreCiudad: ciudad.nombre
            }
        });
        if (ciudadFound) {
            return new common_1.HttpException('La Ciudad ya existe. Prueba nuevamente.', common_1.HttpStatus.CONFLICT);
        }
        const newCiudad = this.ciudadRepository.create({ nombreCiudad: ciudad.nombre });
        await this.ciudadRepository.save(newCiudad);
        return {
            message: 'Ciudad creada exitosamente',
            ciudad: newCiudad,
        };
    }
    getCiudades() {
        return this.ciudadRepository.find();
    }
    async getCiudad(nombreCiudad) {
        const ciudadFound = await this.ciudadRepository.findOne({
            where: {
                nombreCiudad
            }
        });
        if (!ciudadFound) {
            return null;
        }
        return ciudadFound;
    }
    async getCiudadId(idCiudad) {
        const ciudadFound = await this.ciudadRepository.findOne({
            where: {
                idCiudad
            }
        });
        if (!ciudadFound) {
            return new common_1.HttpException("Ciudad no encontrada.", common_1.HttpStatus.NOT_FOUND);
        }
        return ciudadFound;
    }
    async deleteCiudad(idCiudad) {
        const ciudadFound = await this.ciudadRepository.findOne({
            where: { idCiudad }
        });
        if (!ciudadFound) {
            return new common_1.HttpException("Ciudad no encontrada.", common_1.HttpStatus.NOT_FOUND);
        }
        ciudadFound.eliminado = true;
        await this.ciudadRepository.save(ciudadFound);
        throw new common_1.HttpException('Ciudad eliminada.', common_1.HttpStatus.ACCEPTED);
    }
    async updateCiudad(idCiudad, ciudad) {
        const ciudadFound = await this.ciudadRepository.findOne({
            where: {
                idCiudad
            }
        });
        if (!ciudadFound) {
            return new common_1.HttpException("Ciudad no encontrada.", common_1.HttpStatus.NOT_FOUND);
        }
        const updateCiudad = Object.assign(ciudadFound, ciudad);
        return this.ciudadRepository.save(updateCiudad);
    }
};
exports.CiudadService = CiudadService;
exports.CiudadService = CiudadService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(ciudad_entity_1.Ciudad)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CiudadService);
//# sourceMappingURL=ciudad.service.js.map