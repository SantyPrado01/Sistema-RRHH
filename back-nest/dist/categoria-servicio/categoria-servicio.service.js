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
exports.CategoriaServicioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const categoria_servicio_entity_1 = require("./entities/categoria-servicio.entity");
const typeorm_2 = require("typeorm");
let CategoriaServicioService = class CategoriaServicioService {
    constructor(categoriaServicioRepository) {
        this.categoriaServicioRepository = categoriaServicioRepository;
    }
    async createCategoriaServicio(categoriaServicio) {
        const categoriaServicioFound = await this.categoriaServicioRepository.findOne({
            where: {
                nombreCategoriaServico: categoriaServicio.nombre
            }
        });
        if (categoriaServicioFound) {
            return new common_1.HttpException('La Categoria ya existe. Prueba nuevamanete.', common_1.HttpStatus.CONFLICT);
        }
        const newCategoriaServicio = this.categoriaServicioRepository.create({ nombreCategoriaServico: categoriaServicio.nombre });
        await this.categoriaServicioRepository.save(newCategoriaServicio);
        return {
            message: 'Categoria creada exitosamente',
            categoriaServicio: newCategoriaServicio,
        };
    }
    getCategoriasServicios() {
        return this.categoriaServicioRepository.find({
            where: { eliminado: false }
        });
    }
    async getCategoriaServicio(nombreCategoriaServico) {
        const categoriaServicioFound = await this.categoriaServicioRepository.findOne({
            where: {
                nombreCategoriaServico
            }
        });
        if (!nombreCategoriaServico) {
            return null;
        }
        return categoriaServicioFound;
    }
    async getCategoriaServicioId(categoriaServicioId) {
        const categoriaServicioFound = await this.categoriaServicioRepository.findOne({
            where: {
                categoriaServicioId
            }
        });
        if (!categoriaServicioFound) {
            return new common_1.HttpException('Categoria no encontrada.', common_1.HttpStatus.NOT_FOUND);
        }
        return categoriaServicioFound;
    }
    async deleteCategoriaServicio(categoriaServicioId) {
        const categoriaServicioFound = await this.categoriaServicioRepository.findOne({
            where: {
                categoriaServicioId
            }
        });
        if (!categoriaServicioFound) {
            return new common_1.HttpException('Categoria no encontrada.', common_1.HttpStatus.NOT_FOUND);
        }
        categoriaServicioFound.eliminado = true;
        await this.categoriaServicioRepository.save(categoriaServicioFound);
        throw new common_1.HttpException('Categoria eliminada.', common_1.HttpStatus.ACCEPTED);
    }
    async updateCategoriaServicio(categoriaServicioId, categoriaServicio) {
        const categoriaServicioFound = await this.categoriaServicioRepository.findOne({
            where: {
                categoriaServicioId
            }
        });
        if (!categoriaServicioFound) {
            return new common_1.HttpException('Categoria no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        const updateCategoriaServicio = Object.assign(categoriaServicioFound, categoriaServicio);
        return this.categoriaServicioRepository.save(updateCategoriaServicio);
    }
};
exports.CategoriaServicioService = CategoriaServicioService;
exports.CategoriaServicioService = CategoriaServicioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_servicio_entity_1.CategoriaServicio)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriaServicioService);
//# sourceMappingURL=categoria-servicio.service.js.map