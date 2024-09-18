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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./user.entity");
const typeorm_2 = require("typeorm");
const common_2 = require("@nestjs/common");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async createUser(user) {
        const userFound = await this.userRepository.findOne({
            where: {
                username: user.username
            }
        });
        if (userFound) {
            return new common_2.HttpException('El usuario ya existe. Prueba nuevamente.', common_2.HttpStatus.CONFLICT);
        }
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }
    getUsers() {
        return this.userRepository.find();
    }
    async getUsername(username) {
        const userFound = await this.userRepository.findOne({
            where: {
                username
            }
        });
        if (!userFound) {
            return null;
        }
        return userFound;
    }
    async getUserId(id) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        });
        if (!userFound) {
            return new common_2.HttpException('Usuario no encontrado', common_2.HttpStatus.NOT_FOUND);
        }
        return userFound;
    }
    async deleteUser(id) {
        const userFound = await this.userRepository.findOne({
            where: { id }
        });
        if (!userFound) {
            return new common_2.HttpException('Usuario no encontrado.', common_2.HttpStatus.NOT_FOUND);
        }
        userFound.eliminado = true;
        await this.userRepository.save(userFound);
        throw new common_2.HttpException('Usuario eliminado.', common_2.HttpStatus.ACCEPTED);
    }
    async updateUser(id, user) {
        const userFound = await this.userRepository.findOne({
            where: {
                id
            }
        });
        console.log("Se Actualizo");
        ;
        if (!userFound) {
            return new common_2.HttpException('Usuario no encontrado.', common_2.HttpStatus.NOT_FOUND);
        }
        const updateUser = Object.assign(userFound, user);
        return this.userRepository.save(updateUser);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map