import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, Repository } from 'typeorm';
import { HorarioAsignado } from './entities/horariosAsignados.entity'; 
import { CreateHorariosAsignadoDto } from './dto/createHorariosAsignados.dto'; 
import { OrdenTrabajo } from 'src/ordenTrabajo/entities/ordenTrabajo.entity'; 
import { Empleado } from 'src/empleados/entities/empleado.entity';

interface EmpleadoConHoras {
  empleado: Empleado;
  totalHoras: number;
}

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
    fechaInicio?: string,
    fechaFin?: string,
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

    // 📆 Filtro por rango de fechas
    if (fechaInicio && fechaFin) {
      query.andWhere('horario.fecha BETWEEN :inicio AND :fin', {
        inicio: `${fechaInicio} 00:00:00`,
        fin: `${fechaFin} 23:59:59`,
      });
    }

    // 👤 Filtro por empleado (titular o suplente)
    if (empleadoId) {
      query.andWhere(
        '(empleado.Id = :empleadoId AND horario.suplente = false OR empleadoSuplente.Id = :empleadoId AND horario.suplente = true)',
        { empleadoId },
      );
    }

    // 🛠 Filtro por servicio
    if (servicioId) {
      query.andWhere('servicio.servicioId = :servicioId', { servicioId });
    }

    query.orderBy('horario.fecha', 'ASC');

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
          (empleado.Id = :empleadoId)
          OR (empleadoSuplente.Id = :empleadoId)
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

    // Ordenar por fecha antes de obtener los resultados
    query.orderBy('horario.fecha', 'ASC');
  
    const horarios = await query.getMany();
  
    // Inicializar el conteo con todos los estados posibles
    const conteo: Record<string, number> = {
      'Asistió': 0,
      'Llegó Tarde': 0,
      'Faltó Con Aviso': 0,
      'Faltó Sin Aviso': 0,
      'Enfermedad': 0,
    };
  
    // Realizar el conteo
    for (const horario of horarios) { 
      let estadoFinal: string | undefined;
      let horasReales: number | undefined;
  
      if (horario.empleadoSuplente?.Id && Number(horario.empleadoSuplente.Id) === Number(empleadoId)) {
        // Si es suplente, usar estadoSuplente
        estadoFinal = horario.estadoSuplente
        console.log('estado suplente',estadoFinal)
      } else {
        // Si es titular, usar estado normal
        estadoFinal = horario.estado 
        console.log('estado titular',estadoFinal)
      }

      (horario as any).estadoDeterminado = estadoFinal;
      // Incrementar el contador para el estado correspondiente
      if (estadoFinal && conteo.hasOwnProperty(estadoFinal)) {
        conteo[estadoFinal]++;
      }

    }
    return {
      horarios,
      conteo,
    };
  }
  
  async obtenerHorariosPorEmpresa(
    empresaId: number,
    fechaInicio: string,
    fechaFin: string,
  ): Promise<{ horarios: HorarioAsignado[]; conteo: Record<string, number> }> {
    let query = this.horarioAsignadoRepository
      .createQueryBuilder('horario')
      .leftJoinAndSelect('horario.empleado', 'empleado')
      .leftJoinAndSelect('horario.empleadoSuplente', 'empleadoSuplente')
      .leftJoinAndSelect('horario.ordenTrabajo', 'ordenTrabajo')
      .leftJoinAndSelect('ordenTrabajo.servicio', 'servicio')
      .where(
        `(
          (servicio.servicioId = :empresaId)
        )`
      )
      .andWhere('horario.eliminado = false')
      .setParameter('empresaId', empresaId);
  
    // Filtro por mes y año si están presentes
    if (fechaInicio && fechaFin) {
      query.andWhere('horario.fecha BETWEEN :inicio AND :fin', {
          inicio: `${fechaInicio} 00:00:00`,
          fin: `${fechaFin} 23:59:59`,
      });
    }

    // Ordenar por fecha antes de obtener los resultados
    query.orderBy('horario.fecha', 'ASC');
  
    const horarios = await query.getMany();
  

    function calcularHoras(inicio: string, fin: string): number {
      const [hInicio, mInicio] = inicio.split(':').map(Number);
      const [hFin, mFin] = fin.split(':').map(Number);
      
      const inicioMin = hInicio * 60 + mInicio;
      const finMin = hFin * 60 + mFin;
    
      return (finMin - inicioMin) / 60; // retorna en horas
    }
    // Inicializar el conteo con todos los estados posibles
    const conteo: Record<string, number> = {
      'Horas Proyectadas': 0,
      'Horas Reales': 0,
    };
  
    // Realizar el conteo
    for (const horario of horarios) { 
      
        // 🟢 Sumar horas proyectadas si existen ambas
      if (horario.horaInicioProyectado && horario.horaFinProyectado) {
        const horas = calcularHoras(horario.horaInicioProyectado, horario.horaFinProyectado);
        conteo['Horas Proyectadas'] += horas;
      }

      // 🟡 (Opcional) Sumar horas reales si existen ambas
      if (horario.horaInicioReal && horario.horaFinReal) {
        const horas = calcularHoras(horario.horaInicioReal, horario.horaFinReal);
        conteo['Horas Reales'] += horas;
      }
    }
  
    return {
      horarios,
      conteo,
    };
  }

  async obtenerResumenPorEmpresa(
    fechaInicio: string,
    fechaFin: string,
    empresaId?: number,
  ): Promise<{
    resumenPorEmpresa: {
      servicioId: number;
      nombreServicio: string;
      horasProyectadas: number;
      horasReales: number;
    }[];
    totalHorasProyectadas: number;
    totalHorasReales: number;
  }> {
    const query = this.horarioAsignadoRepository
      .createQueryBuilder('horario')
      .leftJoinAndSelect('horario.empleado', 'empleado')
      .leftJoinAndSelect('horario.empleadoSuplente', 'empleadoSuplente')
      .leftJoinAndSelect('horario.ordenTrabajo', 'ordenTrabajo')
      .leftJoinAndSelect('ordenTrabajo.servicio', 'servicio')
      .where('horario.eliminado = false')
      .andWhere('horario.eliminado = false')

    if (fechaInicio && fechaFin) {
      query.andWhere('horario.fecha BETWEEN :inicio AND :fin', {
          inicio: `${fechaInicio} 00:00:00`,
          fin: `${fechaFin} 23:59:59`,
      });
    }

    if (empresaId) {
      query.andWhere('servicio.servicioId = :empresaId', { empresaId });
    }
    const horarios = await query.getMany();

    // Función para calcular horas entre dos strings HH:mm (con cruce nocturno)
    function calcularHoras(inicio: string, fin: string): number {
      const [hInicio, mInicio] = inicio.split(':').map(Number);
      const [hFin, mFin] = fin.split(':').map(Number);

      const inicioMin = hInicio * 60 + mInicio;
      const finMin = hFin * 60 + mFin;

      const duracionMin = finMin >= inicioMin
        ? finMin - inicioMin
        : (24 * 60 - inicioMin) + finMin;

      return duracionMin / 60;
    }

    // Agrupador por empresa (servicioId)
    const resumenMap = new Map<number, {
      servicioId: number;
      nombreServicio: string;
      horasFijas: string;
      horasProyectadas: number;
      horasReales: number;
    }>();

    let totalHorasProyectadas = 0;
    let totalHorasReales = 0;

    for (const horario of horarios) {
      const servicio = horario.ordenTrabajo?.servicio;
      if (!servicio) continue;

      const id = servicio.servicioId;

      if (!resumenMap.has(id)) {
        resumenMap.set(id, {
          servicioId: id,
          nombreServicio: servicio.nombre,
          horasFijas: servicio.horasFijas || "0",
          horasProyectadas: 0,
          horasReales: 0,
        });
      }

      const empresaResumen = resumenMap.get(id)!;
      // Sumar horas proyectadas
      if (horario.horaInicioProyectado && horario.horaFinProyectado) {
        const horas = calcularHoras(horario.horaInicioProyectado, horario.horaFinProyectado);
        empresaResumen.horasProyectadas += horas;
        totalHorasProyectadas += horas;
      }
      // Sumar horas reales
      if (horario.horaInicioReal && horario.horaFinReal) {
        const horas = calcularHoras(horario.horaInicioReal, horario.horaFinReal);
        empresaResumen.horasReales += horas;
        totalHorasReales += horas;
      }
    }

    return {
      resumenPorEmpresa: Array.from(resumenMap.values()),
      totalHorasProyectadas,
      totalHorasReales,
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

  async obtenerEmpleadosOrdenadosPorDiaActual(): Promise<{ empleado: Empleado; totalHoras: number }[]> {
    const ahora = new Date();
    const fechaInicio = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 0, 0, 0);
    const fechaFin = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate(), 23, 59, 59);

    // 1. Obtener TODOS los empleados
    const empleados = await this.empleadoRepository.find();

    // 2. Obtener horarios del día
    const horarios = await this.horarioAsignadoRepository.find({
      where: {
        eliminado: false,
        suplente: false,
        fecha: Between(fechaInicio, fechaFin),
      },
      relations: ['empleado'],
    });

    // 3. Calcular horas por empleado
    const mapa = new Map<number, { empleado: Empleado; totalHoras: number }>();

    for (const h of horarios) {
      const horas = this.calcularHoras(h.horaInicioProyectado, h.horaFinProyectado);
      const id = h.empleado.Id;

      if (!mapa.has(id)) {
        mapa.set(id, { empleado: h.empleado, totalHoras: horas });
      } else {
        mapa.get(id)!.totalHoras += horas;
      }
    }

    // 4. Agregar empleados sin horarios con 0 horas
    for (const emp of empleados) {
      if (!mapa.has(emp.Id)) {
        mapa.set(emp.Id, {
          empleado: emp,
          totalHoras: 0,
        });
      }
    }

    return Array.from(mapa.values()).sort((a, b) => a.totalHoras - b.totalHoras);
  }



  calcularHoras(horaInicio: string, horaFin: string): number {
  const [h1, m1] = horaInicio.split(':').map(Number);
  const [h2, m2] = horaFin.split(':').map(Number);

  const minutosInicio = h1 * 60 + m1;
  const minutosFin = h2 * 60 + m2;

  if (minutosFin >= minutosInicio) {
    // Caso normal, mismo día
    return (minutosFin - minutosInicio) / 60;
  } else {
    // Caso nocturno, pasa medianoche
    const minutosHastaMedianoche = 24 * 60 - minutosInicio;
    return (minutosHastaMedianoche + minutosFin) / 60;
  }
}

  calcularHorasDecimal(horaInicio: string, horaFin: string): number {
    const [hInicio, mInicio] = horaInicio.split(':').map(Number);
    const [hFin, mFin] = horaFin.split(':').map(Number);
  
    const inicioEnMinutos = hInicio * 60 + mInicio;
    const finEnMinutos = hFin * 60 + mFin;

    const diferenciaMinutos = finEnMinutos - inicioEnMinutos;
    const horasDecimales = diferenciaMinutos / 60;
  
    return parseFloat(horasDecimales.toFixed(2)); 
  }

}