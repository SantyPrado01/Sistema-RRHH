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
exports.RolUsuarioService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rol_usuario_entity_1 = require("./entities/rol-usuario.entity");
const typeorm_2 = require("typeorm");
let RolUsuarioService = class RolUsuarioService {
    constructor(rolUsuarioRepository) {
        this.rolUsuarioRepository = rolUsuarioRepository;
    }
    async createRolUsuario(rolUsuario) {
        const rolUsuarioFound = await this.rolUsuarioRepository.findOne({
            where: {
                nombreRolUsuario: rolUsuario.nombre
            }
        });
        if (rolUsuarioFound) {
            return new common_1.HttpException('El rol de ususario  ya existe. Prueba nuevamente.', common_1.HttpStatus.CONFLICT);
        }
        const newRolUsuario = this.rolUsuarioRepository.create({ nombreRolUsuario: rolUsuario.nombre });
        await this.rolUsuarioRepository.save(newRolUsuario);
        return {
            message: 'Rol creado con exito.',
            rolUsuario: newRolUsuario,
        };
    }
    getRolUsuarios() {
        return this.rolUsuarioRepository.find({
            where: { eliminado: false }
        });
    }
    async getRolUsuario(nombreRolUsuario) {
        const rolUsuarioFound = await this.rolUsuarioRepository.findOne({
            where: {
                nombreRolUsuario
            }
        });
        if (!nombreRolUsuario) {
            return null;
        }
        return rolUsuarioFound;
    }
    async getRolUsuarioId(id) {
        const rolUsuarioFound = await this.rolUsuarioRepository.findOne({
            where: {
                id
            }
        });
        if (!rolUsuarioFound) {
            return new common_1.HttpException('Rol no encontrado.', common_1.HttpStatus.NOT_FOUND);
        }
        return rolUsuarioFound;
    }
    async deleteRolUsuario(id) {
        const rolUsuarioFound = await this.rolUsuarioRepository.findOne({
            where: {
                id
            }
        });
        if (!id) {
            return new common_1.HttpException('Rol no encontrado.', common_1.HttpStatus.NOT_FOUND);
        }
        rolUsuarioFound.eliminado = true;
        await this.rolUsuarioRepository.save(rolUsuarioFound);
        throw new common_1.HttpException('Rol Eliminado.', common_1.HttpStatus.ACCEPTED);
    }
    async updateRolUsuario(id, rolUsuario) {
        const rolUsuarioFound = await this.rolUsuarioRepository.findOne({
            where: {
                id
            }
        });
        if (!rolUsuarioFound) {
            return new common_1.HttpException('Rol no encontrado.', common_1.HttpStatus.NOT_FOUND);
        }
        const updateRolUsuario = Object.assign(rolUsuarioFound);
        return this.rolUsuarioRepository.save(updateRolUsuario);
    }
};
exports.RolUsuarioService = RolUsuarioService;
exports.RolUsuarioService = RolUsuarioService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rol_usuario_entity_1.RolUsuario)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], RolUsuarioService);
//# sourceMappingURL=rol-usuario.service.js.map