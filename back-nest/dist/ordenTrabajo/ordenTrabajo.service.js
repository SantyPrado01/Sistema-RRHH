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
const ordenTrabajo_entity_1 = require("./entities/ordenTrabajo.entity");
const empleado_entity_1 = require("../empleados/entities/empleado.entity");
const servicio_entity_1 = require("../servicios/entities/servicio.entity");
const necesidadHoraria_entity_1 = require("../necesidadHoraria/entities/necesidadHoraria.entity");
const horariosAsignados_entity_1 = require("../horariosAsignados/entities/horariosAsignados.entity");
let OrdenTrabajoService = class OrdenTrabajoService {
    constructor(ordenTrabajoRepository, empleadoRepository, servicioRepository, necesidadHorariaRepository, horarioAsignadoRepository) {
        this.ordenTrabajoRepository = ordenTrabajoRepository;
        this.empleadoRepository = empleadoRepository;
        this.servicioRepository = servicioRepository;
        this.necesidadHorariaRepository = necesidadHorariaRepository;
        this.horarioAsignadoRepository = horarioAsignadoRepository;
    }
    async createOrdenTrabajo(createOrdenTrabajoDto) {
        const { servicio, empleadoAsignado, mes, anio } = createOrdenTrabajoDto;
        const empleadoExistente = await this.empleadoRepository.findOne({ where: { Id: empleadoAsignado.Id } });
        if (!empleadoExistente)
            throw new common_1.NotFoundException('Empleado no encontrado');
        const servicioExistente = await this.servicioRepository.findOne({ where: { servicioId: servicio.servicioId } });
        if (!servicioExistente)
            throw new common_1.NotFoundException('Servicio no encontrado');
        const nuevaOrdenTrabajo = this.ordenTrabajoRepository.create({
            servicio: servicioExistente,
            empleadoAsignado: empleadoExistente,
            mes,
            anio
        });
        return this.ordenTrabajoRepository.save(nuevaOrdenTrabajo);
    }
    async createNecesidadHoraria(ordenTrabajoId, necesidadesHorarias) {
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({ where: { Id: ordenTrabajoId } });
        if (!ordenTrabajo)
            throw new common_1.NotFoundException('Orden de trabajo no encontrada');
        const nuevasNecesidades = necesidadesHorarias.map((necesidad) => this.necesidadHorariaRepository.create({
            ...necesidad,
            ordenTrabajo,
        }));
        return this.necesidadHorariaRepository.save(nuevasNecesidades);
    }
    async createAsignarHorarios(ordenTrabajoId) {
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
            where: { Id: ordenTrabajoId },
            relations: ['necesidadHoraria', 'empleadoAsignado'],
        });
        if (!ordenTrabajo)
            throw new common_1.NotFoundException('Orden de trabajo no encontrada');
        const horariosAsignados = [];
        const necesidadesValidas = ordenTrabajo.necesidadHoraria.filter((necesidad) => necesidad.horaInicio && necesidad.horaFin && necesidad.horaInicio !== '00:00:00' && necesidad.horaFin !== '00:00:00');
        console.log("Necesidades válidas:", necesidadesValidas);
        for (const necesidad of necesidadesValidas) {
            const fechas = this.obtenerFechasDelMes(ordenTrabajo.anio, ordenTrabajo.mes, necesidad.diaSemana);
            console.log(`Fechas generadas para el día ${necesidad.diaSemana}:`, fechas);
            for (const fecha of fechas) {
                const horarioAsignado = this.horarioAsignadoRepository.create({
                    ordenTrabajo,
                    empleado: ordenTrabajo.empleadoAsignado,
                    fecha,
                    horaInicioProyectado: necesidad.horaInicio,
                    horaFinProyectado: necesidad.horaFin,
                    estado: 'pendiente',
                    suplente: false,
                    empleadoSuplente: null,
                });
                horariosAsignados.push(horarioAsignado);
            }
        }
        console.log("Horarios asignados antes de guardar:", horariosAsignados);
        const resultadoGuardado = await this.horarioAsignadoRepository.save(horariosAsignados);
        console.log("Resultado después de guardar:", resultadoGuardado);
        return resultadoGuardado;
    }
    obtenerFechasDelMes(anio, mes, diaSemana) {
        console.log('Funcion Fechas');
        const fechas = [];
        const primerDiaMes = new Date(anio, mes - 1, 1);
        const ultimoDiaMes = new Date(anio, mes, 0).getDate();
        const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const diaIndice = parseInt(diaSemana) - 1;
        if (diaIndice < 0 || diaIndice > 6)
            return fechas;
        for (let dia = 1; dia <= ultimoDiaMes; dia++) {
            const fecha = new Date(anio, mes - 1, dia);
            if (fecha.getDay() === diaIndice) {
                fechas.push(fecha);
            }
        }
        console.log(fechas);
        return fechas;
    }
    async findAll() {
        return this.ordenTrabajoRepository.find({ relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'] });
    }
    async findOne(id) {
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
            where: { Id: id },
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
        if (updateOrdenTrabajoDto.empleadoAsignado.Id) {
            const empleado = await this.empleadoRepository.findOne({
                where: { Id: updateOrdenTrabajoDto.empleadoAsignado.Id }
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
    __param(0, (0, typeorm_1.InjectRepository)(ordenTrabajo_entity_1.OrdenTrabajo)),
    __param(1, (0, typeorm_1.InjectRepository)(empleado_entity_1.Empleado)),
    __param(2, (0, typeorm_1.InjectRepository)(servicio_entity_1.Servicio)),
    __param(3, (0, typeorm_1.InjectRepository)(necesidadHoraria_entity_1.NecesidadHoraria)),
    __param(4, (0, typeorm_1.InjectRepository)(horariosAsignados_entity_1.HorarioAsignado)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrdenTrabajoService);
//# sourceMappingURL=ordenTrabajo.service.js.map