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
        const { servicio, empleadoAsignado, mes, anio, diaEspecifico, horaInicio, horaFin } = createOrdenTrabajoDto;
        const empleadoExistente = await this.empleadoRepository.findOne({ where: { Id: empleadoAsignado.Id } });
        if (!empleadoExistente)
            throw new common_1.NotFoundException('Empleado no encontrado');
        const servicioExistente = await this.servicioRepository.findOne({ where: { servicioId: servicio.servicioId } });
        if (!servicioExistente)
            throw new common_1.NotFoundException('Servicio no encontrado');
        let mesExtraido = mes;
        let anioExtraido = anio;
        console.log(mesExtraido);
        if (diaEspecifico) {
            const fecha = new Date(diaEspecifico);
            mesExtraido = fecha.getMonth() + 1;
            anioExtraido = fecha.getFullYear();
        }
        const nuevaOrdenTrabajo = this.ordenTrabajoRepository.create({
            servicio: servicioExistente,
            empleadoAsignado: empleadoExistente,
            mes: mesExtraido,
            anio: anioExtraido,
            diaEspecifico,
            horaInicio,
            horaFin
        });
        console.log('Datos de la orden antes de guardar:', nuevaOrdenTrabajo);
        const ordenGuardada = await this.ordenTrabajoRepository.save(nuevaOrdenTrabajo);
        console.log('Orden de trabajo guardada:', ordenGuardada);
        return ordenGuardada;
    }
    async createNecesidadHoraria(ordenTrabajoId, necesidadesHorarias) {
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({ where: { Id: ordenTrabajoId }, relations: ['empleadoAsignado'] });
        if (!ordenTrabajo)
            throw new common_1.NotFoundException('Orden de trabajo no encontrada');
        const empleado = ordenTrabajo.empleadoAsignado;
        if (empleado.fulltime) {
            console.log('Orden de Trabajo ID:', ordenTrabajoId);
            const nuevasNecesidades = necesidadesHorarias.map((necesidad) => this.necesidadHorariaRepository.create({
                ...necesidad,
                ordenTrabajo,
            }));
            return this.necesidadHorariaRepository.save(nuevasNecesidades);
        }
        const disponibilidades = empleado.disponibilidades;
        console.log(disponibilidades);
        const esValida = (horaInicioNecesidad, horaFinNecesidad, horaInicioDisponibilidad, horaFinDisponibilidad) => {
            const inicioNecesidad = new Date(`1970-01-01T${horaInicioNecesidad}`);
            const finNecesidad = new Date(`1970-01-01T${horaFinNecesidad}`);
            const inicioDipsonibilidad = new Date(`1970-01-01T${horaInicioDisponibilidad}`);
            const FinDisponibilidad = new Date(`1970-01-01T${horaFinDisponibilidad}`);
            const esValida = inicioNecesidad >= inicioDipsonibilidad && finNecesidad <= FinDisponibilidad;
            console.log("Es Valida", esValida);
            return esValida;
        };
        for (const necesidad of necesidadesHorarias) {
            const { diaSemana, horaInicio, horaFin } = necesidad;
            if (!horaInicio || !horaFin) {
                console.log(`No se valida la necesidad para el dia ${diaSemana} porque no tiene horarios asignados.`);
                continue;
            }
            const disponibilidadEmpleado = disponibilidades.find(d => d.diaSemana === diaSemana);
            if (disponibilidadEmpleado) {
                if (!esValida(horaInicio, horaFin, disponibilidadEmpleado.horaInicio, disponibilidadEmpleado.horaFin)) {
                    await this.deleteOrdenTrabajo(ordenTrabajoId);
                    throw new common_1.BadRequestException(`La Necesidad Horaria para el dia ${diaSemana} no esta completamente dentro de la disponibilidad del empleado.`);
                }
            }
            else {
                console.log(`No hay disponibilidad para el día ${diaSemana}, pero no se valida.`);
            }
        }
        const nuevasNecesidades = necesidadesHorarias.map((necesidad) => this.necesidadHorariaRepository.create({
            ...necesidad,
            ordenTrabajo,
        }));
        return this.necesidadHorariaRepository.save(nuevasNecesidades);
    }
    async createAsignarHorarioUnico(ordenTrabajoId, diaEspecifico, horaInicio, horaFin) {
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
            where: { Id: ordenTrabajoId },
            relations: ['empleadoAsignado'],
        });
        if (!ordenTrabajo)
            throw new common_1.NotFoundException('Orden de trabajo no encontrada');
        const horarioAsignado = this.horarioAsignadoRepository.create({
            ordenTrabajo,
            empleado: ordenTrabajo.empleadoAsignado,
            fecha: diaEspecifico,
            horaInicioProyectado: horaInicio,
            horaFinProyectado: horaFin,
            estado: 'pendiente',
            suplente: false,
            empleadoSuplente: null,
        });
        return this.horarioAsignadoRepository.save(horarioAsignado);
    }
    async createAsignarHorarios(ordenTrabajoId) {
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({ where: { Id: ordenTrabajoId }, relations: ['necesidadHoraria', 'empleadoAsignado'] });
        if (!ordenTrabajo)
            throw new common_1.NotFoundException('Orden de trabajo no encontrada');
        const horariosAsignados = [];
        const necesidadesValidas = ordenTrabajo.necesidadHoraria.filter((necesidad) => necesidad.horaInicio && necesidad.horaFin && necesidad.horaInicio !== '00:00:00' && necesidad.horaFin !== '00:00:00');
        for (const necesidad of necesidadesValidas) {
            const fechas = this.obtenerFechasDelMes(ordenTrabajo.anio, ordenTrabajo.mes, necesidad.diaSemana.toString());
            for (const fecha of fechas) {
                const horarioAsignado = this.horarioAsignadoRepository.create({
                    ordenTrabajo,
                    empleado: ordenTrabajo.empleadoAsignado,
                    fecha,
                    horaInicioProyectado: necesidad.horaInicio,
                    horaFinProyectado: necesidad.horaFin,
                    estado: 'Pendiente',
                    suplente: false,
                    empleadoSuplente: null,
                });
                horariosAsignados.push(horarioAsignado);
            }
        }
        const resultadoGuardado = await this.horarioAsignadoRepository.save(horariosAsignados);
        return resultadoGuardado;
    }
    obtenerFechasDelMes(anio, mes, diaSemana) {
        console.log('Funcion Fechas');
        const fechas = [];
        const primerDiaMes = new Date(anio, mes - 1, 1);
        const ultimoDiaMes = new Date(anio, mes, 0).getDate();
        const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
        const diaIndice = parseInt(diaSemana);
        console.log(diaIndice);
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
        const ordenes = await this.ordenTrabajoRepository.find({ relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'] });
        const result = await Promise.all(ordenes.map(async (orden) => {
            let horasProyectadas = 0;
            let horasReales = 0;
            if (orden.diaEspecifico === null) {
                const todosComprobados = orden.horariosAsignados.every((horario) => horario.comprobado === true);
                if (todosComprobados) {
                    orden.completado = true;
                    await this.ordenTrabajoRepository.save(orden);
                }
                orden.horariosAsignados.forEach((horario) => {
                    if (horario.horaInicioProyectado && horario.horaFinProyectado) {
                        const [horaInicioProyectado, minutoInicioProyectado] = horario.horaInicioProyectado.split(':');
                        const [horaFinProyectado, minutoFinProyectado] = horario.horaFinProyectado.split(':');
                        const horaInicio = new Date();
                        horaInicio.setHours(parseInt(horaInicioProyectado), parseInt(minutoInicioProyectado), 0, 0);
                        const horaFin = new Date();
                        horaFin.setHours(parseInt(horaFinProyectado), parseInt(minutoFinProyectado), 0, 0);
                        const horas = (horaFin.getTime() - horaInicio.getTime()) / 3600000;
                        horasProyectadas += horas;
                    }
                    if (horario.horaInicioReal && horario.horaFinReal) {
                        const [horaRealInicio, minutoRealInicio] = horario.horaInicioReal.split(':');
                        const [horaRealFin, minutoRealFin] = horario.horaFinReal.split(':');
                        const horaRealInicioDate = new Date();
                        horaRealInicioDate.setHours(parseInt(horaRealInicio), parseInt(minutoRealInicio), 0, 0);
                        const horaRealFinDate = new Date();
                        horaRealFinDate.setHours(parseInt(horaRealFin), parseInt(minutoRealFin), 0, 0);
                        const horasRealesCalculadas = (horaRealFinDate.getTime() -
                            horaRealInicioDate.getTime()) /
                            3600000;
                        horasReales += horasRealesCalculadas;
                    }
                });
            }
            else {
                if (orden.horaInicio && orden.horaFin) {
                    const horarioAsignado = orden.horariosAsignados[0];
                    console.log(horarioAsignado);
                    const comprobado = horarioAsignado ? horarioAsignado.comprobado : false;
                    if (comprobado === true) {
                        orden.completado = true;
                        await this.ordenTrabajoRepository.save(orden);
                    }
                    const [horaInicio, minutoInicio] = orden.horaInicio.split(':');
                    const [horaFin, minutoFin] = orden.horaFin.split(':');
                    const horaInicioDate = new Date(orden.diaEspecifico);
                    horaInicioDate.setHours(parseInt(horaInicio), parseInt(minutoInicio), 0, 0);
                    const horaFinDate = new Date(orden.diaEspecifico);
                    horaFinDate.setHours(parseInt(horaFin), parseInt(minutoFin), 0, 0);
                    horasProyectadas = (horaFinDate.getTime() - horaInicioDate.getTime()) / 3600000;
                    horasReales = horasProyectadas;
                }
            }
            return {
                ...orden,
                horasProyectadas,
                horasReales,
            };
        }));
        return result;
    }
    async findOne(id) {
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
            where: { Id: id },
            relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
        });
        if (!ordenTrabajo)
            throw new common_1.NotFoundException('Orden de trabajo no encontrada');
        let horasProyectadas = 0;
        let horasReales = 0;
        ordenTrabajo.horariosAsignados.forEach(horario => {
            if (horario.horaInicioProyectado && horario.horaFinProyectado) {
                const [horaInicioProyectado, minutoInicioProyectado] = horario.horaInicioProyectado.split(":");
                const [horaFinProyectado, minutoFinProyectado] = horario.horaFinProyectado.split(":");
                const horaInicio = new Date();
                horaInicio.setHours(parseInt(horaInicioProyectado), parseInt(minutoInicioProyectado), 0, 0);
                const horaFin = new Date();
                horaFin.setHours(parseInt(horaFinProyectado), parseInt(minutoFinProyectado), 0, 0);
                const horas = (horaFin.getTime() - horaInicio.getTime()) / 3600000;
                horasProyectadas += horas;
            }
            if (horario.horaInicioReal && horario.horaFinReal) {
                const [horaRealInicio, minutoRealInicio] = horario.horaInicioReal.split(":");
                const [horaRealFin, minutoRealFin] = horario.horaFinReal.split(":");
                const horaRealInicioDate = new Date();
                horaRealInicioDate.setHours(parseInt(horaRealInicio), parseInt(minutoRealInicio), 0, 0);
                const horaRealFinDate = new Date();
                horaRealFinDate.setHours(parseInt(horaRealFin), parseInt(minutoRealFin), 0, 0);
                const horasRealesCalculadas = (horaRealFinDate.getTime() - horaRealInicioDate.getTime()) / 3600000;
                horasReales += horasRealesCalculadas;
            }
        });
        return {
            ...ordenTrabajo,
            horasProyectadas: horasProyectadas,
            horasReales: horasReales,
        };
    }
    async findMesAnio(mes, anio) {
        const ordenes = await this.ordenTrabajoRepository.find({
            where: { mes: mes, anio: anio },
            relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
        });
        const result = ordenes.map(orden => {
            let horasProyectadas = 0;
            let horasReales = 0;
            orden.horariosAsignados.forEach(horario => {
                if (horario.horaInicioProyectado && horario.horaFinProyectado) {
                    const [horaInicioProyectado, minutoInicioProyectado] = horario.horaInicioProyectado.split(":");
                    const [horaFinProyectado, minutoFinProyectado] = horario.horaFinProyectado.split(":");
                    const horaInicio = new Date();
                    horaInicio.setHours(parseInt(horaInicioProyectado), parseInt(minutoInicioProyectado), 0, 0);
                    const horaFin = new Date();
                    horaFin.setHours(parseInt(horaFinProyectado), parseInt(minutoFinProyectado), 0, 0);
                    const horas = (horaFin.getTime() - horaInicio.getTime()) / 3600000;
                    horasProyectadas += horas;
                }
                if (horario.horaInicioReal && horario.horaFinReal) {
                    const [horaRealInicio, minutoRealInicio] = horario.horaInicioReal.split(":");
                    const [horaRealFin, minutoRealFin] = horario.horaFinReal.split(":");
                    const horaRealInicioDate = new Date();
                    horaRealInicioDate.setHours(parseInt(horaRealInicio), parseInt(minutoRealInicio), 0, 0);
                    const horaRealFinDate = new Date();
                    horaRealFinDate.setHours(parseInt(horaRealFin), parseInt(minutoRealFin), 0, 0);
                    const horasRealesCalculadas = (horaRealFinDate.getTime() - horaRealInicioDate.getTime()) / 3600000;
                    horasReales += horasRealesCalculadas;
                }
            });
            return {
                ...orden,
                horasProyectadas: horasProyectadas,
                horasReales: horasReales
            };
        });
        return result;
    }
    async findForEmpleado(empleadoId) {
        const ordenes = await this.ordenTrabajoRepository.find({
            where: { empleadoAsignado: { Id: empleadoId } },
            relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
        });
        const result = ordenes.map(orden => {
            let horasProyectadas = 0;
            let horasReales = 0;
            const estadoContador = {
                asistio: 0,
                llegoTarde: 0,
                faltoConAviso: 0,
                faltoSinAviso: 0,
                enfermedad: 0,
            };
            orden.horariosAsignados.forEach(horario => {
                if (horario.horaInicioProyectado && horario.horaFinProyectado) {
                    const [horaInicioProyectado, minutoInicioProyectado] = horario.horaInicioProyectado.split(':');
                    const [horaFinProyectado, minutoFinProyectado] = horario.horaFinProyectado.split(':');
                    const horaInicio = new Date();
                    horaInicio.setHours(parseInt(horaInicioProyectado), parseInt(minutoInicioProyectado), 0, 0);
                    const horaFin = new Date();
                    horaFin.setHours(parseInt(horaFinProyectado), parseInt(minutoFinProyectado), 0, 0);
                    const horas = (horaFin.getTime() - horaInicio.getTime()) / 3600000;
                    horasProyectadas += horas;
                }
                if (horario.horaInicioReal && horario.horaFinReal) {
                    const [horaRealInicio, minutoRealInicio] = horario.horaInicioReal.split(':');
                    const [horaRealFin, minutoRealFin] = horario.horaFinReal.split(':');
                    const horaRealInicioDate = new Date();
                    horaRealInicioDate.setHours(parseInt(horaRealInicio), parseInt(minutoRealInicio), 0, 0);
                    const horaRealFinDate = new Date();
                    horaRealFinDate.setHours(parseInt(horaRealFin), parseInt(minutoRealFin), 0, 0);
                    const horasRealesCalculadas = (horaRealFinDate.getTime() - horaRealInicioDate.getTime()) / 3600000;
                    horasReales += horasRealesCalculadas;
                }
                switch (horario.estado) {
                    case 'Asistió':
                        estadoContador.asistio++;
                        break;
                    case 'Llegada Tarde':
                        estadoContador.llegoTarde++;
                        break;
                    case 'Faltó Con Aviso':
                        estadoContador.faltoConAviso++;
                        break;
                    case 'Faltó Sin Aviso':
                        estadoContador.faltoSinAviso++;
                        break;
                    case 'Enfermedad':
                        estadoContador.enfermedad++;
                        break;
                }
            });
            return {
                ...orden,
                horasProyectadas,
                horasReales,
                estadoContador,
            };
        });
        console.log('Consulta Orden Trabajo', result);
        return result;
    }
    async findForEmpleadoByMonthAndYear(empleadoId, mes, anio) {
        const ordenes = await this.ordenTrabajoRepository.find({
            where: {
                empleadoAsignado: { Id: empleadoId },
                mes: mes,
                anio: anio,
            },
            relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
        });
        const result = ordenes.map(orden => {
            let horasProyectadas = 0;
            let horasReales = 0;
            const estadoContador = {
                asistio: 0,
                llegoTarde: 0,
                faltoConAviso: 0,
                faltoSinAviso: 0,
                enfermedad: 0,
            };
            orden.horariosAsignados.forEach(horario => {
                if (horario.horaInicioProyectado && horario.horaFinProyectado) {
                    const [horaInicioProyectado, minutoInicioProyectado] = horario.horaInicioProyectado.split(':');
                    const [horaFinProyectado, minutoFinProyectado] = horario.horaFinProyectado.split(':');
                    const horaInicio = new Date();
                    horaInicio.setHours(parseInt(horaInicioProyectado), parseInt(minutoInicioProyectado), 0, 0);
                    const horaFin = new Date();
                    horaFin.setHours(parseInt(horaFinProyectado), parseInt(minutoFinProyectado), 0, 0);
                    const horas = (horaFin.getTime() - horaInicio.getTime()) / 3600000;
                    horasProyectadas += horas;
                }
                if (horario.horaInicioReal && horario.horaFinReal) {
                    const [horaRealInicio, minutoRealInicio] = horario.horaInicioReal.split(':');
                    const [horaRealFin, minutoRealFin] = horario.horaFinReal.split(':');
                    const horaRealInicioDate = new Date();
                    horaRealInicioDate.setHours(parseInt(horaRealInicio), parseInt(minutoRealInicio), 0, 0);
                    const horaRealFinDate = new Date();
                    horaRealFinDate.setHours(parseInt(horaRealFin), parseInt(minutoRealFin), 0, 0);
                    const horasRealesCalculadas = (horaRealFinDate.getTime() - horaRealInicioDate.getTime()) / 3600000;
                    horasReales += horasRealesCalculadas;
                }
                switch (horario.estado) {
                    case 'Asistió':
                        estadoContador.asistio++;
                        break;
                    case 'Llegada Tarde':
                        estadoContador.llegoTarde++;
                        break;
                    case 'Faltó Con Aviso':
                        estadoContador.faltoConAviso++;
                        break;
                    case 'Faltó Sin Aviso':
                        estadoContador.faltoSinAviso++;
                        break;
                    case 'Enfermedad':
                        estadoContador.enfermedad++;
                        break;
                }
            });
            return {
                ...orden,
                horasProyectadas,
                horasReales,
                estadoContador,
            };
        });
        return result;
    }
    async findForServicio(servicioId) {
        const ordenes = await this.ordenTrabajoRepository.find({
            where: { servicio: { servicioId: servicioId } },
            relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
        });
        const result = ordenes.map(orden => {
            let horasProyectadas = 0;
            let horasReales = 0;
            orden.horariosAsignados.forEach(horario => {
                if (horario.horaInicioProyectado && horario.horaFinProyectado) {
                    const [horaInicioProyectado, minutoInicioProyectado] = horario.horaInicioProyectado.split(':');
                    const [horaFinProyectado, minutoFinProyectado] = horario.horaFinProyectado.split(':');
                    const horaInicio = new Date();
                    horaInicio.setHours(parseInt(horaInicioProyectado), parseInt(minutoInicioProyectado), 0, 0);
                    const horaFin = new Date();
                    horaFin.setHours(parseInt(horaFinProyectado), parseInt(minutoFinProyectado), 0, 0);
                    const horas = (horaFin.getTime() - horaInicio.getTime()) / 3600000;
                    horasProyectadas += horas;
                }
                if (horario.horaInicioReal && horario.horaFinReal) {
                    const [horaRealInicio, minutoRealInicio] = horario.horaInicioReal.split(':');
                    const [horaRealFin, minutoRealFin] = horario.horaFinReal.split(':');
                    const horaRealInicioDate = new Date();
                    horaRealInicioDate.setHours(parseInt(horaRealInicio), parseInt(minutoRealInicio), 0, 0);
                    const horaRealFinDate = new Date();
                    horaRealFinDate.setHours(parseInt(horaRealFin), parseInt(minutoRealFin), 0, 0);
                    const horasRealesCalculadas = (horaRealFinDate.getTime() - horaRealInicioDate.getTime()) / 3600000;
                    horasReales += horasRealesCalculadas;
                }
            });
            return {
                ...orden,
                horasProyectadas: horasProyectadas,
                horasReales: horasReales,
            };
        });
        console.log(result);
        return result;
    }
    async findForServicioByMonthAndYear(servicioId, mes, anio) {
        const ordenes = await this.ordenTrabajoRepository.find({
            where: {
                servicio: { servicioId: servicioId },
                mes: mes,
                anio: anio,
            },
            relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
        });
        const result = ordenes.map(orden => {
            let horasProyectadas = 0;
            let horasReales = 0;
            const estadoContador = {
                asistio: 0,
                llegoTarde: 0,
                faltoConAviso: 0,
                faltoSinAviso: 0,
                enfermedad: 0,
            };
            orden.horariosAsignados.forEach(horario => {
                if (horario.horaInicioProyectado && horario.horaFinProyectado) {
                    const [horaInicioProyectado, minutoInicioProyectado] = horario.horaInicioProyectado.split(':');
                    const [horaFinProyectado, minutoFinProyectado] = horario.horaFinProyectado.split(':');
                    const horaInicio = new Date();
                    horaInicio.setHours(parseInt(horaInicioProyectado), parseInt(minutoInicioProyectado), 0, 0);
                    const horaFin = new Date();
                    horaFin.setHours(parseInt(horaFinProyectado), parseInt(minutoFinProyectado), 0, 0);
                    const horas = (horaFin.getTime() - horaInicio.getTime()) / 3600000;
                    horasProyectadas += horas;
                }
                if (horario.horaInicioReal && horario.horaFinReal) {
                    const [horaRealInicio, minutoRealInicio] = horario.horaInicioReal.split(':');
                    const [horaRealFin, minutoRealFin] = horario.horaFinReal.split(':');
                    const horaRealInicioDate = new Date();
                    horaRealInicioDate.setHours(parseInt(horaRealInicio), parseInt(minutoRealInicio), 0, 0);
                    const horaRealFinDate = new Date();
                    horaRealFinDate.setHours(parseInt(horaRealFin), parseInt(minutoRealFin), 0, 0);
                    const horasRealesCalculadas = (horaRealFinDate.getTime() - horaRealInicioDate.getTime()) / 3600000;
                    horasReales += horasRealesCalculadas;
                }
                switch (horario.estado) {
                    case 'Asistió':
                        estadoContador.asistio++;
                        break;
                    case 'Llegada Tarde':
                        estadoContador.llegoTarde++;
                        break;
                    case 'Faltó Con Aviso':
                        estadoContador.faltoConAviso++;
                        break;
                    case 'Faltó Sin Aviso':
                        estadoContador.faltoSinAviso++;
                        break;
                    case 'Enfermedad':
                        estadoContador.enfermedad++;
                        break;
                }
            });
            return {
                ...orden,
                horasProyectadas,
                horasReales,
                estadoContador,
            };
        });
        return result;
    }
    async obtenerHorasPorMes(mes, anio) {
        const ordenes = await this.ordenTrabajoRepository.find({
            where: { mes: mes, anio: anio },
            relations: ['horariosAsignados'],
        });
        let horasProyectadas = 0;
        let horasReales = 0;
        ordenes.forEach((orden) => {
            orden.horariosAsignados.forEach((horario) => {
                if (horario.horaInicioProyectado && horario.horaFinProyectado) {
                    const horaInicioProyectado = new Date(`1970-01-01T${horario.horaInicioProyectado}`);
                    const horaFinProyectado = new Date(`1970-01-01T${horario.horaFinProyectado}`);
                    const diffProyectadas = (horaFinProyectado.getTime() - horaInicioProyectado.getTime()) / 1000 / 60 / 60;
                    horasProyectadas += diffProyectadas;
                }
                if (horario.horaInicioReal && horario.horaFinReal) {
                    const horaInicioReal = new Date(`1970-01-01T${horario.horaInicioReal}`);
                    const horaFinReal = new Date(`1970-01-01T${horario.horaFinReal}`);
                    const diffReales = (horaFinReal.getTime() - horaInicioReal.getTime()) / 1000 / 60 / 60;
                    horasReales += diffReales;
                }
            });
        });
        return {
            horasProyectadas,
            horasReales,
        };
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
    async deleteOrdenTrabajo(id) {
        const result = await this.ordenTrabajoRepository.delete(id);
        if (result.affected === 0)
            throw new common_1.NotFoundException('Orden de trabajo no encontrada');
    }
    async delete(id) {
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
            where: { Id: id },
            relations: ['horariosAsignados'],
        });
        if (!ordenTrabajo) {
            throw new Error('Orden de trabajo no encontrada');
        }
        ordenTrabajo.eliminado = true;
        ordenTrabajo.fechaEliminado = new Date();
        await this.ordenTrabajoRepository.save(ordenTrabajo);
        const fechaEliminacion = ordenTrabajo.fechaEliminado;
        const horariosAsignados = await this.horarioAsignadoRepository.find({
            where: {
                ordenTrabajo: { Id: id },
                fecha: (0, typeorm_2.MoreThanOrEqual)(fechaEliminacion),
            },
        });
        for (const horario of horariosAsignados) {
            horario.eliminado = true;
            horario.estado = 'Eliminado';
            await this.horarioAsignadoRepository.save(horario);
        }
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