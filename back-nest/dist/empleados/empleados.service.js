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
const disponibilidad_horaria_entity_1 = require("../disponibilidad-horaria/entities/disponibilidad-horaria.entity");
let EmpleadosService = class EmpleadosService {
    constructor(empleadoRepository, disponibilidadRepository) {
        this.empleadoRepository = empleadoRepository;
        this.disponibilidadRepository = disponibilidadRepository;
    }
    async createEmpleado(createEmpleadoDto) {
        const newEmpleado = this.empleadoRepository.create(createEmpleadoDto);
        const savedEmpleado = await this.empleadoRepository.save(newEmpleado);
        console.log('Empleado creado:', savedEmpleado);
        return savedEmpleado;
    }
    async createDisponibilidad(empleadoId, createDisponibilidadHorariaDto) {
        if (!createDisponibilidadHorariaDto) {
            createDisponibilidadHorariaDto = [];
        }
        const diasSemana = [1, 2, 3, 4, 5, 6, 7];
        const diasDefinidos = new Set(createDisponibilidadHorariaDto.map(d => d.diaSemana));
        for (const dia of diasSemana) {
            if (!diasDefinidos.has(dia)) {
                createDisponibilidadHorariaDto.push({
                    empleadoId: empleadoId,
                    diaSemana: dia,
                    horaInicio: '',
                    horaFin: '',
                });
            }
        }
        const disponibilidades = createDisponibilidadHorariaDto.map(diaSemanaDto => {
            const disponibilidad = new disponibilidad_horaria_entity_1.DisponibilidadHoraria();
            disponibilidad.empleadoId = empleadoId;
            disponibilidad.diaSemana = diaSemanaDto.diaSemana;
            disponibilidad.horaInicio = diaSemanaDto.horaInicio;
            disponibilidad.horaFin = diaSemanaDto.horaFin;
            return disponibilidad;
        });
        return await this.disponibilidadRepository.save(disponibilidades);
    }
    get() {
        return this.empleadoRepository.find({});
    }
    getEliminado() {
        return this.empleadoRepository.find({ where: { eliminado: false } });
    }
    async getId(id) {
        const empleadoFound = await this.empleadoRepository.findOne({
            where: { Id: id },
            relations: ['categoria']
        });
        if (!empleadoFound) {
            return new common_1.HttpException('Empleado no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return empleadoFound;
    }
    async delete(empleadoId) {
        const empleadoFound = await this.empleadoRepository.findOne({
            where: {
                Id: empleadoId
            }
        });
        if (!empleadoFound) {
            return new common_1.HttpException('Empleado no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        empleadoFound.eliminado = true;
        await this.empleadoRepository.save(empleadoFound);
        throw new common_1.HttpException('Empleado eliminado.', common_1.HttpStatus.ACCEPTED);
    }
    async update(empleadoId, empleado) {
        const empleadoFound = await this.empleadoRepository.findOne({
            where: {
                Id: empleadoId
            }
        });
        if (!empleadoFound) {
            return new common_1.HttpException('Empleado no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        const updateEmpleado = Object.assign(empleadoFound, empleado);
        return this.empleadoRepository.save(updateEmpleado);
    }
    async updateDisponibilidad(empleadoId, updateDisponibilidadDto) {
        const empleado = await this.empleadoRepository.findOne({
            where: { Id: empleadoId },
            relations: ['disponibilidades'],
        });
        console.log('Este es el empleado antes del update', empleado);
        if (!empleado) {
            throw new Error('Empleado no encontrado.');
        }
        for (const disponibilidad of empleado.disponibilidades) {
            const disponibilidadDto = updateDisponibilidadDto.find((item) => item.disponibilidadHorariaId === disponibilidad.disponibilidadHorariaId);
            if (disponibilidadDto) {
                if (disponibilidadDto.horaInicio)
                    disponibilidad.horaInicio = disponibilidadDto.horaInicio;
                if (disponibilidadDto.horaFin)
                    disponibilidad.horaFin = disponibilidadDto.horaFin;
                if (disponibilidadDto.diaSemana)
                    disponibilidad.diaSemana = disponibilidadDto.diaSemana;
            }
            disponibilidad.empleadoId = empleadoId;
        }
        await this.disponibilidadRepository.save(empleado.disponibilidades);
        console.log('Estas son las disponibilidades al guardar', empleado.disponibilidades);
        return { message: 'Disponibilidades actualizadas con éxito' };
    }
};
exports.EmpleadosService = EmpleadosService;
exports.EmpleadosService = EmpleadosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(empleado_entity_1.Empleado)),
    __param(1, (0, typeorm_1.InjectRepository)(disponibilidad_horaria_entity_1.DisponibilidadHoraria)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EmpleadosService);
//# sourceMappingURL=empleados.service.js.map