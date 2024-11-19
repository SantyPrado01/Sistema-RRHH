import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { OrdenTrabajo } from './entities/ordenTrabajo.entity'; 
import { CreateOrdenTrabajoDto } from './dto/createOrdenTrabajo.dto'; 
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { UpdateOrdenTrabajoDto } from './dto/updateOrdenTrabajo.dto'; 
import { CreateNecesidadHorariaDto } from 'src/necesidadHoraria/dto/createNecesidadHoraria.dto'; 
import { NecesidadHoraria } from 'src/necesidadHoraria/entities/necesidadHoraria.entity'; 
import { HorarioAsignado } from 'src/horariosAsignados/entities/horariosAsignados.entity'; 
import { OrdenTrabajoConHoras } from './interface/orden-trabajo-con-horas.interface';

@Injectable()
export class OrdenTrabajoService {
  constructor(
    @InjectRepository(OrdenTrabajo)
    private readonly ordenTrabajoRepository: Repository<OrdenTrabajo>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
    @InjectRepository(NecesidadHoraria)
    private readonly necesidadHorariaRepository: Repository<NecesidadHoraria>,
    @InjectRepository(HorarioAsignado)
    private readonly horarioAsignadoRepository: Repository<HorarioAsignado>,
  ) {}

  async createOrdenTrabajo(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo> {
    const { servicio, empleadoAsignado, mes, anio } = createOrdenTrabajoDto;
    console.log(createOrdenTrabajoDto)
    console.log('ID del empleado',empleadoAsignado)
    const empleadoExistente = await this.empleadoRepository.findOne({ where: { Id: empleadoAsignado.Id } });
    if (!empleadoExistente) throw new NotFoundException('Empleado no encontrado');
    console.log(empleadoExistente)
    const servicioExistente = await this.servicioRepository.findOne({ where: { servicioId: servicio.servicioId } });
    if (!servicioExistente) throw new NotFoundException('Servicio no encontrado');
    console.log(servicioExistente)
    const nuevaOrdenTrabajo = this.ordenTrabajoRepository.create({
      servicio: servicioExistente,
      empleadoAsignado: empleadoExistente,
      mes,
      anio
    });

    console.log('Datos de la orden antes de guardar:', nuevaOrdenTrabajo);
    const ordenGuardada = await this.ordenTrabajoRepository.save(nuevaOrdenTrabajo);
    console.log('Orden de trabajo guardada:', ordenGuardada);
    return ordenGuardada;
  }
  
  async createNecesidadHoraria(
    ordenTrabajoId: number,
    necesidadesHorarias: CreateNecesidadHorariaDto[],
  ): Promise<NecesidadHoraria[]> {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({ where: { Id :ordenTrabajoId } });
    if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');
    console.log('Orden de Trabajo ID:', ordenTrabajoId)
    const nuevasNecesidades = necesidadesHorarias.map((necesidad) => 
      this.necesidadHorariaRepository.create({
        ...necesidad,
        ordenTrabajo,
      })
    );
    return this.necesidadHorariaRepository.save(nuevasNecesidades);
  }

  async createAsignarHorarios(ordenTrabajoId: number) {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
      where: { Id: ordenTrabajoId },
      relations: ['necesidadHoraria', 'empleadoAsignado'],
    });
    if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');
    const horariosAsignados = [];
    const necesidadesValidas = ordenTrabajo.necesidadHoraria.filter(
      (necesidad) => necesidad.horaInicio && necesidad.horaFin && necesidad.horaInicio !== '00:00:00' && necesidad.horaFin !== '00:00:00'
    );
    for (const necesidad of necesidadesValidas) {
      const fechas = this.obtenerFechasDelMes(ordenTrabajo.anio, ordenTrabajo.mes, necesidad.diaSemana);
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
    const resultadoGuardado = await this.horarioAsignadoRepository.save(horariosAsignados);
    return resultadoGuardado;
  }
  
  private obtenerFechasDelMes(anio: number, mes: number, diaSemana: string): Date[] {
    console.log('Funcion Fechas');
    const fechas: Date[] = [];
    const primerDiaMes = new Date(anio, mes - 1, 1); 
    const ultimoDiaMes = new Date(anio, mes, 0).getDate(); 
    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    const diaIndice = parseInt(diaSemana) - 1; 
    if (diaIndice < 0 || diaIndice > 6) return fechas;
    for (let dia = 1; dia <= ultimoDiaMes; dia++) {
      const fecha = new Date(anio, mes - 1, dia); 
      if (fecha.getDay() === diaIndice) {
        fechas.push(fecha); 
      }
    }
    console.log(fechas);
    return fechas;
  }
  
  async findAll(): Promise<OrdenTrabajo[]> {
    const ordenes = await this.ordenTrabajoRepository.find({ relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'] });

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

  async findOne(id: number): Promise<OrdenTrabajoConHoras> {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
      where: { Id: id },
      relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
    });
  
    if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');
  
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
    } as OrdenTrabajoConHoras;
  }
  
  

  async findMesAnio(mes: number, anio: number, completado: boolean): Promise<any> {
    const ordenes = await this.ordenTrabajoRepository.find({
      where: { mes: mes, anio: anio, completado: completado },
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

  async findForEmpleado(mes: number,anio: number,completado: boolean,empleadoId: number): Promise<any> {
    const ordenes = await this.ordenTrabajoRepository.find({
      where: {
        mes: mes,
        anio: anio,
        completado: completado,
        empleadoAsignado: { Id: empleadoId }, 
      },
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
    return result;
  }

  async findForServicio(mes: number, anio: number, completado: boolean, servicioId: number): Promise<any> {
    const ordenes = await this.ordenTrabajoRepository.find({
      where: {
        mes: mes,
        anio: anio,
        completado: completado,
        servicio: { servicioId: servicioId },
      },
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
    console.log(result)
    return result;
  }
  
    

  async obtenerHorasPorMes(mes: number, anio: number, completado: boolean): Promise<any> {
    const ordenes = await this.ordenTrabajoRepository.find({
      where: { mes: mes, anio: anio, completado: completado },
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
  
  async update(id: number, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto): Promise<OrdenTrabajo> {
    const ordenTrabajo = await this.findOne(id);
    if (updateOrdenTrabajoDto.servicio.servicioId) {
      const servicio = await this.servicioRepository.findOne({
        where: { servicioId: updateOrdenTrabajoDto.servicio.servicioId }
      });
      if (!servicio) throw new NotFoundException('Servicio no encontrado');
      ordenTrabajo.servicio = servicio;
    }
    if (updateOrdenTrabajoDto.empleadoAsignado.Id) {
      const empleado = await this.empleadoRepository.findOne({
        where:{Id:updateOrdenTrabajoDto.empleadoAsignado.Id}
      });
      if (!empleado) throw new NotFoundException('Empleado no encontrado');
      ordenTrabajo.empleadoAsignado = empleado;
    }
    Object.assign(ordenTrabajo, updateOrdenTrabajoDto);
    return this.ordenTrabajoRepository.save(ordenTrabajo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ordenTrabajoRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Orden de trabajo no encontrada');
  }
  
  

  private validarDisponibilidadEmpleado(
    empleado: Empleado,
    necesidad: NecesidadHoraria
  ): boolean {

    const diaSemanaMapping: { [key: string]: number } = {
      'lunes': 1,
      'martes': 2,
      'miércoles': 3,
      'jueves': 4,
      'viernes': 5,
      'sábado': 6,
      'domingo': 7,
    };

    const diaSemanaNecesidad = diaSemanaMapping[necesidad.diaSemana.toLowerCase()];
    
    if (diaSemanaNecesidad === undefined) {
      return false;
    }

    const disponibilidadDelEmpleado = empleado.disponibilidades.find(
      (disponibilidad) => disponibilidad.diaSemana === diaSemanaNecesidad
    );
    if (!disponibilidadDelEmpleado || disponibilidadDelEmpleado.horaInicio === '00:00:00' || disponibilidadDelEmpleado.horaFin === '00:00:00') {
      return false; 
    }
    const horaInicioNecesidad = this.convertirHoraToDate(necesidad.horaInicio);
    const horaFinNecesidad = this.convertirHoraToDate(necesidad.horaFin);
  
    const horaInicioDisponibilidad = this.convertirHoraToDate(disponibilidadDelEmpleado.horaInicio);
    const horaFinDisponibilidad = this.convertirHoraToDate(disponibilidadDelEmpleado.horaFin);
    if (horaInicioNecesidad < horaInicioDisponibilidad || horaFinNecesidad > horaFinDisponibilidad) {
      return false;  
    }
    return true;
  }

  private convertirHoraToDate(hora: string): Date {
    const [horas, minutos, segundos] = hora.split(':').map(Number);
    const fecha = new Date();
    fecha.setHours(horas, minutos, segundos, 0);  
    return fecha;
  }
  
}