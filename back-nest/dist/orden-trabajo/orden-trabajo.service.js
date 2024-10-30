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
exports.OrdenTrabajoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const orden_trabajo_entity_1 = require("./entities/orden-trabajo.entity");
const empleado_entity_1 = require("../empleados/entities/empleado.entity");
const servicio_entity_1 = require("../servicios/entities/servicio.entity");
let OrdenTrabajoService = class OrdenTrabajoService {
    constructor(ordenTrabajoRepository, empleadoRepository, servicioRepository) {
        this.ordenTrabajoRepository = ordenTrabajoRepository;
        this.empleadoRepository = empleadoRepository;
        this.servicioRepository = servicioRepository;
    }
    async create(createOrdenTrabajoDto) {
        const { servicio, empleadoAsignado, mes, anio } = createOrdenTrabajoDto;
        const empleadoExistente = await this.empleadoRepository.findOne({ where: { empleadoId: empleadoAsignado.empleadoId } });
        if (!empleadoExistente) {
            throw new common_1.NotFoundException('Empleado no encontrado');
        }
        const servicioExistente = await this.servicioRepository.findOne({ where: { servicioId: servicio.servicioId } });
        if (!servicioExistente) {
            throw new common_1.NotFoundException('Servicio no encontrado');
        }
        const nuevaOrdenTrabajo = this.ordenTrabajoRepository.create({
            servicio: servicioExistente,
            empleadoAsignado: empleadoExistente,
            mes,
            anio
        });
        const ordenTrabajoGuardada = await this.ordenTrabajoRepository.save(nuevaOrdenTrabajo);
        return ordenTrabajoGuardada;
    }
    async findAll() {
        return this.ordenTrabajoRepository.find({ relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'] });
    }
    async findOne(id) {
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
            where: { ordenTrabajoId: id },
            relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
        });
        if (!ordenTrabajo)
            throw new common_1.NotFoundException('Orden de trabajo no encontrada');
        return ordenTrabajo;
    }
    async update(id, updateOrdenTrabajoDto) {
        const ordenTrabajo = await this.findOne(id);
        if (updateOrdenTrabajoDto.servicio.servicioId) {
            const servicio = await this.servicioRepository.findOne({
                where: { servicioId: updateOrdenTrabajoDto.servicio.servicioId }
            });
            if (!servicio)
                throw new common_1.NotFoundException('Servicio no encontrado');
            ordenTrabajo.servicio = servicio;
        }
        if (updateOrdenTrabajoDto.empleadoAsignado.empleadoId) {
            const empleado = await this.empleadoRepository.findOne({
                where: { empleadoId: updateOrdenTrabajoDto.empleadoAsignado.empleadoId }
            });
            if (!empleado)
                throw new common_1.NotFoundException('Empleado no encontrado');
            ordenTrabajo.empleadoAsignado = empleado;
        }
        Object.assign(ordenTrabajo, updateOrdenTrabajoDto);
        return this.ordenTrabajoRepository.save(ordenTrabajo);
    }
    async remove(id) {
        const result = await this.ordenTrabajoRepository.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException('Orden de trabajo no encontrada');
    }
};
exports.OrdenTrabajoService = OrdenTrabajoService;
exports.OrdenTrabajoService = OrdenTrabajoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(orden_trabajo_entity_1.OrdenTrabajo)),
    __param(1, (0, typeorm_1.InjectRepository)(empleado_entity_1.Empleado)),
    __param(2, (0, typeorm_1.InjectRepository)(servicio_entity_1.Servicio)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdenTrabajoService);
//# sourceMappingURL=orden-trabajo.service.js.map