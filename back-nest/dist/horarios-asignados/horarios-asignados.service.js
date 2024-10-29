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
exports.HorarioAsignadoService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const horarios_asignado_entity_1 = require("./entities/horarios-asignado.entity");
const orden_trabajo_entity_1 = require("../orden-trabajo/entities/orden-trabajo.entity");
const empleado_entity_1 = require("../empleados/entities/empleado.entity");
let HorarioAsignadoService = class HorarioAsignadoService {
    constructor(horarioAsignadoRepository, ordenTrabajoRepository, empleadoRepository) {
        this.horarioAsignadoRepository = horarioAsignadoRepository;
        this.ordenTrabajoRepository = ordenTrabajoRepository;
        this.empleadoRepository = empleadoRepository;
    }
    async create(ordenTrabajoId) {
        const ordenTrabajoExistente = await this.ordenTrabajoRepository.findOne({
            where: { ordenTrabajoId },
        });
        if (!ordenTrabajoExistente) {
            throw new common_1.NotFoundException('Orden de trabajo no encontrada');
        }
        const { anio, mes, dias, horaInicio, horaFin } = ordenTrabajoExistente;
        const horariosAsignados = [];
        const primerDia = new Date(anio, mes - 1, 1);
        const ultimoDia = new Date(anio, mes, 0);
        const diasDeLaSemana = {
            'Domingo': 0,
            'Lunes': 1,
            'Martes': 2,
            'Miércoles': 3,
            'Jueves': 4,
            'Viernes': 5,
            'Sábado': 6,
        };
        for (let dia = primerDia.getDate(); dia <= ultimoDia.getDate(); dia++) {
            const fechaActual = new Date(anio, mes - 1, dia);
            const diaDeLaSemana = fechaActual.toLocaleString('es-ES', { weekday: 'long' });
            if (diasDeLaSemana[diaDeLaSemana] !== undefined && dias.includes(diaDeLaSemana)) {
                const horarioAsignado = this.horarioAsignadoRepository.create({
                    fecha: fechaActual,
                    horaInicioProyectado: horaInicio,
                    horaFinProyectado: horaFin,
                    estado: 'pendiente',
                    suplente: false,
                });
                horariosAsignados.push(horarioAsignado);
            }
        }
        return await this.horarioAsignadoRepository.save(horariosAsignados);
    }
    async findAll() {
        return await this.horarioAsignadoRepository.find({
            relations: ['ordenTrabajo', 'empleado', 'empleadoSuplente'],
        });
    }
    async findOne(id) {
        const horarioAsignado = await this.horarioAsignadoRepository.findOne({
            where: { horarioAsignadoId: id },
            relations: ['ordenTrabajo', 'empleado', 'empleadoSuplente'],
        });
        if (!horarioAsignado) {
            throw new common_1.NotFoundException('Horario asignado no encontrado');
        }
        return horarioAsignado;
    }
    async update(id, updateData) {
        await this.horarioAsignadoRepository.update(id, updateData);
        return this.findOne(id);
    }
    async remove(id) {
        const result = await this.horarioAsignadoRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('Horario asignado no encontrado');
        }
    }
};
exports.HorarioAsignadoService = HorarioAsignadoService;
exports.HorarioAsignadoService = HorarioAsignadoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(horarios_asignado_entity_1.HorarioAsignado)),
    __param(1, (0, typeorm_1.InjectRepository)(orden_trabajo_entity_1.OrdenTrabajo)),
    __param(2, (0, typeorm_1.InjectRepository)(empleado_entity_1.Empleado)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], HorarioAsignadoService);
//# sourceMappingURL=horarios-asignados.service.js.map