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
exports.DisponibilidadHorariaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const disponibilidad_horaria_entity_1 = require("./entities/disponibilidad-horaria.entity");
const empleados_service_1 = require("../empleados/empleados.service");
let DisponibilidadHorariaService = class DisponibilidadHorariaService {
    constructor(disponibilidadHorariaRepository, empleadoService) {
        this.disponibilidadHorariaRepository = disponibilidadHorariaRepository;
        this.empleadoService = empleadoService;
    }
    async create(createDisponibilidadHorariaDto) {
        const empleado = await this.empleadoService.getId(createDisponibilidadHorariaDto.empleadoId);
        if (!empleado) {
            throw new common_1.NotFoundException(`Empleado con ID ${createDisponibilidadHorariaDto.empleadoId} no encontrado`);
        }
        const nuevaDisponibilidad = this.disponibilidadHorariaRepository.create({
            ...createDisponibilidadHorariaDto,
            empleado: empleado,
        });
        console.log(nuevaDisponibilidad);
        return this.disponibilidadHorariaRepository.save(nuevaDisponibilidad);
    }
    async findAll() {
        return this.disponibilidadHorariaRepository.find({ relations: ['empleado'] });
    }
    async findOne(id) {
        const disponibilidad = await this.disponibilidadHorariaRepository.findOne({
            where: { disponibilidadHorariaId: id },
            relations: ['empleado'],
        });
        if (!disponibilidad) {
            throw new common_1.NotFoundException(`Disponibilidad horaria con ID ${id} no encontrada`);
        }
        return disponibilidad;
    }
    async update(id, updateDisponibilidadHorariaDto) {
        const disponibilidad = await this.disponibilidadHorariaRepository.preload({
            disponibilidadHorariaId: id,
            ...updateDisponibilidadHorariaDto,
        });
        if (!disponibilidad) {
            throw new common_1.NotFoundException(`Disponibilidad horaria con ID ${id} no encontrada`);
        }
        return this.disponibilidadHorariaRepository.save(disponibilidad);
    }
    async remove(id) {
        const result = await this.disponibilidadHorariaRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Disponibilidad horaria con ID ${id} no encontrada`);
        }
    }
};
exports.DisponibilidadHorariaService = DisponibilidadHorariaService;
exports.DisponibilidadHorariaService = DisponibilidadHorariaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(disponibilidad_horaria_entity_1.DisponibilidadHoraria)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        empleados_service_1.EmpleadosService])
], DisponibilidadHorariaService);
//# sourceMappingURL=disponibilidad-horaria.service.js.map