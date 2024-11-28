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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
let AuthService = class AuthService {
    constructor(userRepository, jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }
    async register({ username, categoriaId }) {
        const user = await this.userRepository.findOne({ where: { username: username } });
        if (user) {
            throw new common_1.HttpException('El usuario ya existe', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        console.log('registerDto', username, categoriaId);
        const createUserDto = {
            username,
            password: hashedPassword,
            categoriaId: Number(categoriaId),
            eliminado: false,
            primerIngreso: true,
        };
        console.log('createUserDto', createUserDto);
        const newUser = await this.userRepository.save(createUserDto);
        return {
            message: 'Usuario registrado con éxito',
            temporaryPassword: randomPassword,
            user: newUser
        };
    }
    async login({ username, password }) {
        const user = await this.userRepository.findOne({ where: { username: username } });
        if (!user) {
            throw new common_1.HttpException('Usuario no existente', common_1.HttpStatus.NOT_FOUND);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.HttpException('Contraseña incorrecta', common_1.HttpStatus.NOT_ACCEPTABLE);
        }
        if (user.primerIngreso) {
            return {
                id: user.id,
                username: user.username,
                message: 'Debe cambiar su contraseña',
                primerIngreso: true,
            };
        }
        const payload = { username: user.username, role: user.categoria };
        const token = await this.jwtService.signAsync(payload);
        return {
            token,
            username: user.username,
            role: user.categoria,
            primerIngreso: false,
        };
    }
    async changePassword(userId, newPassword) {
        console.log(newPassword);
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.primerIngreso = false;
        await this.userRepository.save(user);
        return { message: 'Contraseña actualizada con éxito' };
    }
    async recoverPassword(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        user.password = hashedPassword;
        user.primerIngreso = true;
        await this.userRepository.save(user);
        return {
            message: 'Contraseña recuperada con éxito',
            temporaryPassword: randomPassword,
            user: {
                id: user.id,
                username: user.username,
                primerIngreso: user.primerIngreso
            }
        };
    }
    async updateUsuario(userId, updateUserDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        if (updateUserDto.password) {
            const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            user.password = hashedPassword;
            user.primerIngreso = true;
        }
        if (updateUserDto.eliminado !== undefined) {
            user.eliminado = updateUserDto.eliminado;
        }
        await this.userRepository.save(user);
        return { message: 'Usuario actualizado con éxito', user };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map