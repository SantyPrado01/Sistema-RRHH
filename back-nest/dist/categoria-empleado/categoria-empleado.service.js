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
exports.CategoriaEmpleadoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const categoria_empleado_entity_1 = require("./entities/categoria-empleado.entity");
const typeorm_2 = require("typeorm");
let CategoriaEmpleadoService = class CategoriaEmpleadoService {
    constructor(categoriaEmpleadoRepository) {
        this.categoriaEmpleadoRepository = categoriaEmpleadoRepository;
    }
    async createCategoriaEmpleado(categoriaEmpleado) {
        const categoriaEmpleadoFound = await this.categoriaEmpleadoRepository.findOne({
            where: {
                categoriaEmpleadoNombre: categoriaEmpleado.nombre
            }
        });
        if (categoriaEmpleadoFound) {
            return new common_1.HttpException('La Categoria ya existe. Prueba nuevamente.', common_1.HttpStatus.CONFLICT);
        }
        const newCategoriaEmpleado = this.categoriaEmpleadoRepository.create({ categoriaEmpleadoNombre: categoriaEmpleado.nombre });
        await this.categoriaEmpleadoRepository.save(newCategoriaEmpleado);
        return {
            message: 'Categoria creada exitosamente.',
            categoriaEmpleado: newCategoriaEmpleado,
        };
    }
    getCategoriasEmpleados() {
        return this.categoriaEmpleadoRepository.find({
            where: { eliminado: false }
        });
    }
    async getCategoriaEmpleado(categoriaEmpleadoNombre) {
        const categoriaEmpleadoFound = await this.categoriaEmpleadoRepository.findOne({
            where: {
                categoriaEmpleadoNombre
            }
        });
        if (!categoriaEmpleadoNombre) {
            return null;
        }
        return categoriaEmpleadoFound;
    }
    async getCategoriaEmpleadoId(categoriaEmpleadoId) {
        const categoriaEmpleadoFound = await this.categoriaEmpleadoRepository.findOne({
            where: {
                categoriaEmpleadoId
            }
        });
        if (!categoriaEmpleadoFound) {
            return new common_1.HttpException('Categoria no encontrada.', common_1.HttpStatus.NOT_FOUND);
        }
        return categoriaEmpleadoFound;
    }
    async deleteCategoriaServicio(categoriaEmpleadoId) {
        const categoriaEmpleadoFound = await this.categoriaEmpleadoRepository.findOne({
            where: {
                categoriaEmpleadoId
            }
        });
        if (!categoriaEmpleadoFound) {
            return new common_1.HttpException('Categoria no encontrada', common_1.HttpStatus.NOT_FOUND);
        }
        categoriaEmpleadoFound.eliminado = true;
        await this.categoriaEmpleadoRepository.save(categoriaEmpleadoFound);
        throw new common_1.HttpException('Categoria Eliminada.', common_1.HttpStatus.ACCEPTED);
    }
    async updateCategoriaEmpleado(categoriaEmpleadoId, categoriaEmpleado) {
        const categoriaEmpleadoFound = await this.categoriaEmpleadoRepository.findOne({
            where: {
                categoriaEmpleadoId
            }
        });
        if (!categoriaEmpleadoFound) {
            return new common_1.HttpException('Categoria no encontrada.', common_1.HttpStatus.NOT_FOUND);
        }
        const updateCategoriaEmpleado = Object.assign(categoriaEmpleadoFound, categoriaEmpleado);
        return this.categoriaEmpleadoRepository.save(updateCategoriaEmpleado);
    }
};
exports.CategoriaEmpleadoService = CategoriaEmpleadoService;
exports.CategoriaEmpleadoService = CategoriaEmpleadoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_empleado_entity_1.CategoriaEmpleado)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriaEmpleadoService);
//# sourceMappingURL=categoria-empleado.service.js.map