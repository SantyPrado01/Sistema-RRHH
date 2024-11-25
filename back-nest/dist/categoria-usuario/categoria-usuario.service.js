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
exports.CategoriaUsuarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const categoria_usuario_entity_1 = require("./entities/categoria-usuario.entity");
const typeorm_2 = require("typeorm");
let CategoriaUsuarioService = class CategoriaUsuarioService {
    constructor(categoriaUsuarioRepository) {
        this.categoriaUsuarioRepository = categoriaUsuarioRepository;
    }
    async create(categoriaUsuario) {
        const categoriaUsuarioFound = await this.categoriaUsuarioRepository.findOne({
            where: {
                nombre: categoriaUsuario.nombre
            }
        });
        if (categoriaUsuarioFound) {
            return new common_1.HttpException('La Categoria ya existe. Prueba nuevamente.', common_1.HttpStatus.CONFLICT);
        }
        ;
        const newCategoriaUsuario = this.categoriaUsuarioRepository.create({ nombre: categoriaUsuario.nombre });
        await this.categoriaUsuarioRepository.save(newCategoriaUsuario);
        return {
            message: 'Categoria creada exitosamente',
            categoriaUsuario: newCategoriaUsuario,
        };
    }
    findAll() {
        return this.categoriaUsuarioRepository.find();
    }
    async findName(nombreCategoriaUsuario) {
        const categoriaUsuarioFound = await this.categoriaUsuarioRepository.findOne({
            where: {
                nombre: nombreCategoriaUsuario
            }
        });
        if (!nombreCategoriaUsuario) {
            return null;
        }
        return categoriaUsuarioFound;
    }
    async findOne(categoriaUsuarioId) {
        const categoriaUsuarioFound = await this.categoriaUsuarioRepository.findOne({
            where: {
                id: categoriaUsuarioId
            }
        });
        if (!categoriaUsuarioFound) {
            return new common_1.HttpException('Categoria no encontrada.', common_1.HttpStatus.NOT_FOUND);
        }
        return categoriaUsuarioFound;
    }
    async update(categoriaUsuarioId, categoriaUsuario) {
        const categoriaUsuarioFound = await this.categoriaUsuarioRepository.findOne({
            where: {
                id: categoriaUsuarioId
            }
        });
        if (!categoriaUsuarioFound) {
            return new common_1.HttpException('Categoria no encontradad', common_1.HttpStatus.NOT_FOUND);
        }
        const updateCategoriaUsuario = Object.assign(categoriaUsuarioFound, categoriaUsuario);
        return this.categoriaUsuarioRepository.save(updateCategoriaUsuario);
    }
    async remove(categoriaUsuarioId) {
        const categoriaUsuarioFound = await this.categoriaUsuarioRepository.findOne({
            where: {
                id: categoriaUsuarioId
            }
        });
        if (!categoriaUsuarioFound) {
            return new common_1.HttpException('Categoria no encontrada.', common_1.HttpStatus.NOT_FOUND);
        }
        categoriaUsuarioFound.eliminado = true;
        await this.categoriaUsuarioRepository.save(categoriaUsuarioFound);
        throw new common_1.HttpException('Categoria eliminada.', common_1.HttpStatus.ACCEPTED);
    }
};
exports.CategoriaUsuarioService = CategoriaUsuarioService;
exports.CategoriaUsuarioService = CategoriaUsuarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(categoria_usuario_entity_1.CategoriaUsuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CategoriaUsuarioService);
//# sourceMappingURL=categoria-usuario.service.js.map