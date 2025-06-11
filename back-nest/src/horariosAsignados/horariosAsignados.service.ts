import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { HorarioAsignado } from './entities/horariosAsignados.entity'; 
import { CreateHorariosAsignadoDto } from './dto/createHorariosAsignados.dto'; 
import { OrdenTrabajo } from 'src/ordenTrabajo/entities/ordenTrabajo.entity'; 
import { Empleado } from 'src/empleados/entities/empleado.entity';

@Injectable()
export class HorarioAsignadoService {
  constructor(
      @InjectRepository(HorarioAsignado)
      private readonly horarioAsignadoRepository: Repository<HorarioAsignado>,

      @InjectRepository(OrdenTrabajo)
      private readonly ordenTrabajoRepository: Repository<OrdenTrabajo>,

      @InjectRepository(Empleado)
      private readonly empleadoRepository: Repository<Empleado>,
  ) {}

  async create(createHorariosDto: CreateHorariosAsignadoDto) {
      const { ordenTrabajoId } = createHorariosDto;
      const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
          where: { Id: ordenTrabajoId },
          relations: ['empleadoAsignado', 'necesidadHoraria'], 
      });
  
      if (!ordenTrabajo) {
          throw new Error('Orden de trabajo no encontrada');
      }
  
      const { anio, mes, necesidadHoraria, empleadoAsignado } = ordenTrabajo;
      const horariosAsignados = [];
  
      for (const necesidad of necesidadHoraria) {
          const fechas = this.obtenerFechasDelMes(anio, mes, necesidad.diaSemana.toString());
  
          for (const fecha of fechas) {
              const horarioAsignado = this.horarioAsignadoRepository.create({
                  ordenTrabajo,
                  empleado: empleadoAsignado,
                  fecha: fecha,
                  horaInicioProyectado: necesidad.horaInicio,
                  horaFinProyectado: necesidad.horaFin,
                  estado: 'Pendiente',
                  suplente: false,
                  empleadoSuplente: null,
                  estadoSuplente: null,
              });
              horariosAsignados.push(horarioAsignado);
          }
      }

      await this.horarioAsignadoRepository.save(horariosAsignados);
      return horariosAsignados;
  }

  private obtenerFechasDelMes(anio: number, mes: number, diaSemana: string): Date[] {
      const fechas: Date[] = [];
      const primerDiaMes = new Date(anio, mes - 1, 1);
      const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
      const diaIndice = diasSemana.indexOf(diaSemana.toLowerCase());
  
      if (diaIndice === -1) return fechas;
  
      for (let dia = primerDiaMes.getDate(); dia <= new Date(anio, mes, 0).getDate(); dia++) {
        const fecha = new Date(anio, mes - 1, dia);
        if (fecha.getDay() === diaIndice) {
          fechas.push(fecha);
        }
      }
      return fechas;
  }

  async getHorariosAsignados(): Promise<HorarioAsignado[]> {
      const today = new Date();
      return this.horarioAsignadoRepository.find({
          where: {
              comprobado: false,
              fecha: LessThan(today), 
          },
          relations: ['ordenTrabajo', 'empleado', 'empleadoSuplente'], 
      });
  }

  async findAll(): Promise<HorarioAsignado[]> {
      return await this.horarioAsignadoRepository.find({
          relations: ['ordenTrabajo', 'empleado'], 
          
      });
  }

  async findOne(id: number): Promise<HorarioAsignado> {
      const horarioAsignado = await this.horarioAsignadoRepository.findOne({
          where: { horarioAsignadoId: id },
          relations: ['ordenTrabajo', 'empleado', 'empleadoSuplente'],
      });

      if (!horarioAsignado) {
          throw new NotFoundException('Horario asignado no encontrado');
      }

      return horarioAsignado;
  }

  async buscarHorariosAsignados(
    fecha?: string,
    empleadoId?: number,
    servicioId?: number,
  ): Promise<HorarioAsignado[]> {
    const query = this.horarioAsignadoRepository
      .createQueryBuilder('horario')
      .leftJoinAndSelect('horario.ordenTrabajo', 'ordenTrabajo')
      .leftJoinAndSelect('ordenTrabajo.servicio', 'servicio')
      .leftJoinAndSelect('horario.empleado', 'empleado')
      .leftJoinAndSelect('horario.empleadoSuplente', 'empleadoSuplente')
      .where('horario.eliminado = false');
  
    if (fecha) {
      const fechaObj = new Date(fecha);
      const inicio = fechaObj.toISOString().split('T')[0]; // Solo la fecha en formato YYYY-MM-DD
      query.andWhere('horario.fecha = :inicio', { inicio });
    }
  
    if (empleadoId) {
      query.andWhere(
        '(empleado.Id = :empleadoId AND horario.suplente =false OR empleadoSuplente.Id = :empleadoId AND horario.suplente = true)',
        { empleadoId },
      );
    }
  
    if (servicioId) {
      query.andWhere('servicio.servicioId = :servicioId', { servicioId });
    }

    query.orderBy('empleado.apellido', 'ASC');
  
    return query.getMany();
  }

  async obtenerHorariosPorEmpleado(
    empleadoId: number,
    mes?: number,
    anio?: number,
  ): Promise<{ horarios: HorarioAsignado[]; conteo: Record<string, number> }> {
    let query = this.horarioAsignadoRepository
      .createQueryBuilder('horario')
      .leftJoinAndSelect('horario.empleado', 'empleado')
      .leftJoinAndSelect('horario.empleadoSuplente', 'empleadoSuplente')
      .leftJoinAndSelect('horario.ordenTrabajo', 'ordenTrabajo')
      .leftJoinAndSelect('ordenTrabajo.servicio', 'servicio')
      .where(
        `(
          empleado.Id = :empleadoId
          OR empleadoSuplente.Id = :empleadoId
        )`
      )
      .andWhere('horario.eliminado = false')
      .setParameter('empleadoId', empleadoId);
  
    // Filtro por mes y año si están presentes
    if (mes && anio) {
      const inicio = new Date(anio, mes - 1, 1);
      const fin = new Date(anio, mes, 0, 23, 59, 59);
      query = query
        .andWhere('horario.fecha BETWEEN :inicio AND :fin')
        .setParameters({ inicio, fin });
    }
  
    const horarios = await query.getMany();
  
    // Conteo de estados por rol
    const conteo: Record<string, number> = {
      'Asistió': 0,
      'Llegó Tarde': 0,
      'Faltó Con Aviso': 0,
      'Faltó Sin Aviso': 0,
      'Enfermedad': 0,
    };
  
    for (const horario of horarios) {
      let estadoFinal: string | undefined;
  
      // Si el empleado es el titular
      if (horario.empleado?.Id === empleadoId) {
        estadoFinal = horario.estado;
      }
  
      // Si el empleado es el suplente y efectivamente fue suplente
      if (horario.empleadoSuplente?.Id === empleadoId && horario.suplente) {
        estadoFinal = horario.estadoSuplente;
      }
  
      if (estadoFinal && conteo.hasOwnProperty(estadoFinal)) {
        conteo[estadoFinal]++;
      }
    }
    // Ordenar por apellido (opcional, ya que acá estás trayendo de un solo empleado)
    query.orderBy('horario.fecha', 'ASC');
  
    return {
      horarios,
      conteo,
    };
  }
  


  async update(id: number, updateData: Partial<CreateHorariosAsignadoDto>): Promise<HorarioAsignado> {
      await this.horarioAsignadoRepository.update(id, updateData);
      return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
      const result = await this.horarioAsignadoRepository.delete(id);
      if (result.affected === 0) {
          throw new NotFoundException('Horario asignado no encontrado');
      }
  }
}