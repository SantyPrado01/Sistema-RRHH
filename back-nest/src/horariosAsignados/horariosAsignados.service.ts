import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, LessThanOrEqual, Repository } from 'typeorm';
import { HorarioAsignado } from './entities/horariosAsignados.entity'; 
import { CreateHorariosAsignadoDto } from './dto/createHorariosAsignados.dto'; 
import { OrdenTrabajo } from 'src/ordenTrabajo/entities/ordenTrabajo.entity'; 
import { Empleado } from 'src/empleados/entities/empleado.entity';

  export interface ResumenServicio {
    nombreServicio: string;
    horario: string;
    dias: string;
    horasAutorizadas: number;
    horasProyectadas: number;
    horasTrabajadas: number;
    horasAusentismoPago: number;
    horasAusentismoNoPago: number;
  }

  export interface ResumenGeneral {
    servicios: ResumenServicio[];
    totales: {
      horasProyectadas: number;
      horasTrabajadas: number;
      horasAusentismoPago: number;
      horasAusentismoNoPago: number;
    };
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
              fecha: LessThanOrEqual(today), 
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

  async obtenerHorariosPorEmpleadoRefactorizado(
    empleadoId: number,
    mes?: number,
    anio?: number,
  ): Promise<{
    horarios: HorarioAsignado[];
    horasAusentismoPago: number;
    horasAusentismoImpago: number;
    horasTrabajadas: number;
    totalHorasPorServicio: Record<string, number>;
    horasDiscriminadas: Record<string, number>;
  }> {
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

    // Estados para ausentismo pago
    const estadosAusentismoPago = ['Enfermedad', 'Vacaciones', 'Licencia', 'Accidente'];
    // Estados para ausentismo impago
    const estadosAusentismoImpago = ['Faltó Con Aviso', 'Faltó Sin Aviso', 'Sin Servicio'];

    // Inicializar contadores
    let horasAusentismoPago = 0;
    let horasAusentismoImpago = 0;
    let horasTrabajadas = 0;
    let horasCategoria = 0
    const totalHorasPorServicio: Record<string, number> = {};
    const horasDiscriminadas: Record<string, number> = {};

    // Función auxiliar para convertir horas a formato decimal
    const convertirHorasADecimal = (horaInicio: string, horaFin: string): number => {
      if (!horaInicio || !horaFin) return 0;

      // Convertir strings de hora a minutos desde medianoche
      const convertirAMinutos = (hora: string): number => {
        const [h, m] = hora.split(':').map(Number);
        return h * 60 + m;
      };

      const minutosInicio = convertirAMinutos(horaInicio);
      console.log('minutos inicio', minutosInicio);
      const minutosFin = convertirAMinutos(horaFin);
      console.log('minutos fin', minutosFin);

      let diferenciaMinutos: number;

      if (minutosFin >= minutosInicio) {
        // Caso normal: misma fecha (ej: 08:00 a 17:00)
        diferenciaMinutos = minutosFin - minutosInicio;
      } else {
        // Horario nocturno que cruza medianoche
        diferenciaMinutos = (24 * 60 - minutosInicio) + minutosFin;
      }

      // Convertir minutos a horas decimales
      return diferenciaMinutos / 60;
    };

    // Realizar el conteo y cálculo de horas
    for (const horario of horarios) {
      let estadoFinal: string | undefined;

      // Determinar qué estado usar según si es suplente o titular
      if (horario.empleadoSuplente?.Id && Number(horario.empleadoSuplente.Id) === Number(empleadoId)) {
        // Si es suplente, usar estadoSuplente
        estadoFinal = horario.estadoSuplente
        horasCategoria = horario.empleadoSuplente.horasCategoria
        console.log('estado suplente', estadoFinal);
      } else {
        // Si es titular, usar estado normal
        estadoFinal = horario.estado
        horasCategoria = horario.empleado.horasCategoria
        console.log('estado titular', estadoFinal);
      }

      // Calcular horas reales (siempre para mostrar en el horario individual)
      let horasReales: number;
      if (estadoFinal === 'Faltó Con Aviso' || estadoFinal === 'Faltó Sin Aviso' || estadoFinal === 'Enfermedad' || estadoFinal === 'Licencia' || estadoFinal === 'Vacaciones' || estadoFinal === 'Accidente' || estadoFinal === 'Sin Servicio') {
        // Para faltas, mostrar 0 horas reales
        horasReales = 0;
      } else {
        // Para otros estados, calcular normalmente
        horasReales = convertirHorasADecimal(
          horario.horaInicioReal,
          horario.horaFinReal
        );
      }

      // Para "Sin Servicio", calcular también las horas proyectadas para los totales
      let horasParaConteo: number;
      if (estadoFinal === 'Sin Servicio' || estadoFinal === 'Enfermedad' || estadoFinal === 'Licencia' || estadoFinal === 'Vacaciones' || estadoFinal === 'Accidente') {
        horasParaConteo = convertirHorasADecimal(
          horario.horaInicioProyectado,
          horario.horaFinProyectado
        );
        console.log(`Sin Servicio - horas reales: ${horasReales.toFixed(2)}, horas proyectadas para conteo: ${horasParaConteo.toFixed(2)}`);
      } else if((estadoFinal === 'Faltó Con Aviso' || estadoFinal === 'Faltó Sin Aviso') && !horario.empleadoSuplente){
        horasParaConteo = convertirHorasADecimal(
          horario.horaInicioProyectado,
          horario.horaFinProyectado
        );
      }
      else {
        horasParaConteo = convertirHorasADecimal(
          horario.horaInicioReal,
          horario.horaFinReal
        );
      }

      // Agregar propiedades calculadas al objeto horario
      (horario as any).estadoDeterminado = estadoFinal;
      (horario as any).horasDecimales = horasReales; // Siempre mostrar horas reales en el horario individual

      // Clasificar horas según el estado
      if (estadoFinal) {
        // Inicializar contador para este estado si no existe
        if (!horasDiscriminadas[estadoFinal]) {
          horasDiscriminadas[estadoFinal] = 0;
        }
        horasDiscriminadas[estadoFinal] += horasParaConteo;

        // Solo sumar a totales si NO es "Sin Servicio"
        if (estadoFinal !== 'Sin Servicio') {
          if (estadosAusentismoPago.includes(estadoFinal)) {
            horasAusentismoPago += horasParaConteo;
          } else if (estadosAusentismoImpago.includes(estadoFinal)) {
            horasAusentismoImpago += horasParaConteo;
          } else {
            horasTrabajadas += horasParaConteo;
          }
        }
      } else {
        // Si no hay estado, considerarlo como horas trabajadas
        horasTrabajadas += horasParaConteo;
      }

      // Sumar horas por servicio (excepto para "Sin Servicio")
      if (estadoFinal !== 'Sin Servicio' && estadoFinal !== 'Faltó Con Aviso' && estadoFinal !== 'Faltó Sin Aviso') {
        const nombreServicio = horario.ordenTrabajo?.servicio?.nombre || 'Sin servicio';
        if (!totalHorasPorServicio[nombreServicio]) {
          totalHorasPorServicio[nombreServicio] = 0;
        }
        totalHorasPorServicio[nombreServicio] += horasParaConteo;
      }

      console.log(`Horario ID: ${horario.horarioAsignadoId}, Estado: ${estadoFinal}, Horas reales: ${horasReales.toFixed(2)}, Horas para conteo: ${horasParaConteo.toFixed(2)}`);
    }

    // Calcular total general de horas (sin incluir "Sin Servicio")
    const totalHoras = horasAusentismoPago + horasAusentismoImpago + horasTrabajadas;

    // Log del resultado final
    console.log('=== RESULTADO FINAL ===');
    console.log('Total de horarios procesados:', horarios.length);
    console.log('Horas Ausentismo Pago:', horasAusentismoPago.toFixed(2));
    console.log('Horas Ausentismo Impago:', horasAusentismoImpago.toFixed(2));
    console.log('Horas Trabajadas:', horasTrabajadas.toFixed(2));
    console.log('Total Horas (sin Sin Servicio):', totalHoras.toFixed(2));
    console.log('Horas por Servicio:', totalHorasPorServicio);
    console.log('Horas Discriminadas por Estado:', horasDiscriminadas);
    console.log('========================');

    return {
      horarios,
      horasAusentismoPago: Number(horasAusentismoPago.toFixed(2)),
      horasAusentismoImpago: Number(horasAusentismoImpago.toFixed(2)),
      horasTrabajadas: Number(horasTrabajadas.toFixed(2)),
      totalHorasPorServicio,
      horasDiscriminadas,
    };
  }

  async obtenerResumenPorServicio(
    mes: number, // 1-12
    anio: number
  ): Promise<ResumenGeneral> {
    
    // Estados para ausentismo pago
    const estadosAusentismoPago = ['Enfermedad', 'Vacaciones', 'Licencia', 'Accidente'];
    // Estados para ausentismo impago
    const estadosAusentismoImpago = ['Faltó Con Aviso', 'Faltó Sin Aviso', 'Sin Servicio'];

    // Obtener registros del mes y año especificado
    console.log(`Filtrando por mes: ${mes}, año: ${anio}`);
    
    const horarios = await this.horarioAsignadoRepository
      .createQueryBuilder('ha')
      .leftJoinAndSelect('ha.ordenTrabajo', 'ot')
      .leftJoinAndSelect('ot.servicio', 's')
      .leftJoinAndSelect('ha.empleado', 'e')
      .where('EXTRACT(MONTH FROM ha.fecha) = :mes', { mes })
      .andWhere('EXTRACT(YEAR FROM ha.fecha) = :anio', { anio })
      .andWhere('ha.eliminado = false')
      .getMany();

    console.log(`Total horarios encontrados: ${horarios.length}`);

    // Agrupar por servicio
    const serviciosMap = new Map<number, {
      servicio: any;
      horarios: HorarioAsignado[];
    }>();

    horarios.forEach(horario => {
      console.log(`Horario ${horario.horarioAsignadoId}: Fecha ${horario.fecha}, Servicio: ${horario.ordenTrabajo?.servicio?.nombre}`);
      
      if (horario.ordenTrabajo?.servicio) {
        const servicioId = horario.ordenTrabajo.servicio.servicioId;
        
        if (!serviciosMap.has(servicioId)) {
          console.log(`Nuevo servicio encontrado: ${horario.ordenTrabajo.servicio.nombre}`);
          serviciosMap.set(servicioId, {
            servicio: horario.ordenTrabajo.servicio,
            horarios: []
          });
        }
        
        serviciosMap.get(servicioId)?.horarios.push(horario);
      }
    });

    // Procesar cada servicio
    const resumen: ResumenServicio[] = [];

    serviciosMap.forEach(({ servicio, horarios }) => {
      // Obtener horario típico (usando el más común)
      const horariosComunes = horarios.reduce((acc, h) => {
        const horario = `${h.horaInicioProyectado} a ${h.horaFinProyectado}`;
        acc[horario] = (acc[horario] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const horarioMasComun = Object.keys(horariosComunes)
        .reduce((a, b) => horariosComunes[a] > horariosComunes[b] ? a : b);

      // Obtener días de la semana (simplificado - podrías mejorarlo analizando las fechas)
      const dias = this.obtenerDiasSemana(horarios);

      // Calcular horas
      const horasAutorizadas = servicio.horasFijas || 0;
      let horasProyectadas = 0;
      let horasTrabajadas = 0;
      let horasAusentismoPago = 0;
      let horasAusentismoNoPago = 0;

      horarios.forEach(horario => {
        console.log(`Procesando horario: ${horario.horarioAsignadoId}, Estado: ${horario.estado}`);
        
        // SIEMPRE sumar horas proyectadas (independiente del estado)
        const horasProyectadasHorario = this.calcularHoras(horario.horaInicioProyectado, horario.horaFinProyectado);
        horasProyectadas += horasProyectadasHorario;
        console.log(`Horas proyectadas: ${horasProyectadasHorario}`);
        
        // Si tiene horas reales, procesarlas
        if (horario.horaInicioReal && 
            horario.horaFinReal && 
            horario.horaInicioReal.trim() !== '' && 
            horario.horaFinReal.trim() !== '') {
          
          const horasReales = this.calcularHoras(horario.horaInicioReal, horario.horaFinReal);
          if (!isNaN(horasReales)) {
            // Clasificar las horas reales según el estado
            if (estadosAusentismoPago.includes(horario.estado)) {
              horasAusentismoPago += horasReales;
              console.log(`Ausentismo pago (horas reales): ${horasReales}`);
            } else if (estadosAusentismoImpago.includes(horario.estado)) {
              horasAusentismoNoPago += horasReales;
              console.log(`Ausentismo no pago (horas reales): ${horasReales}`);
            } else {
              // Horas trabajadas normales (Asistió, etc.)
              horasTrabajadas += horasReales;
              console.log(`Horas trabajadas: ${horasReales}`);
            }
          }
        } else {
          console.log(`Sin horas reales para horario: ${horario.horarioAsignadoId}`);
        }
      });

      resumen.push({
        nombreServicio: servicio.nombre || 'Sin nombre',
        horario: horarioMasComun,
        dias: dias,
        horasAutorizadas: horasAutorizadas,
        horasProyectadas: horasProyectadas,
        horasTrabajadas: horasTrabajadas,
        horasAusentismoPago: horasAusentismoPago,
        horasAusentismoNoPago: horasAusentismoNoPago
      });
        });

    // Calcular totales generales
    const totales = {
      horasProyectadas: 0,
      horasTrabajadas: 0,
      horasAusentismoPago: 0,
      horasAusentismoNoPago: 0
    };

    resumen.forEach(servicio => {
      totales.horasProyectadas += servicio.horasProyectadas;
      totales.horasTrabajadas += servicio.horasTrabajadas;
      totales.horasAusentismoPago += servicio.horasAusentismoPago;
      totales.horasAusentismoNoPago += servicio.horasAusentismoNoPago;
    });

    console.log('=== TOTALES GENERALES ===');
    console.log(`Total Horas Proyectadas: ${totales.horasProyectadas}`);
    console.log(`Total Horas Trabajadas: ${totales.horasTrabajadas}`);
    console.log(`Total Ausentismo Pago: ${totales.horasAusentismoPago}`);
    console.log(`Total Ausentismo No Pago: ${totales.horasAusentismoNoPago}`);

    return {
      servicios: resumen,
      totales: totales
    };
  }

  // Función auxiliar para obtener días de la semana
  obtenerDiasSemana(horarios: HorarioAsignado[]): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const diasTrabajo = new Set<number>();
    
    horarios.forEach(horario => {
      const dia = new Date(horario.fecha).getDay();
      diasTrabajo.add(dia);
    });
    
    const diasArray = Array.from(diasTrabajo).sort();
    
    if (diasArray.length === 0) return 'Sin días definidos';
    
    // Si es solo un día
    if (diasArray.length === 1) {
      return diasSemana[diasArray[0]];
    }
    
    // Si son días consecutivos, mostrar rango
    if (this.sonConsecutivos(diasArray)) {
      return `${diasSemana[diasArray[0]]} a ${diasSemana[diasArray[diasArray.length - 1]]}`;
    }
    
    // Si no son consecutivos, mostrar todos los días separados por comas
    return diasArray.map(dia => diasSemana[dia]).join(', ');
  }

  // Función auxiliar para verificar si los días son consecutivos
  sonConsecutivos(dias: number[]): boolean {
    if (dias.length <= 1) return true;
    
    for (let i = 1; i < dias.length; i++) {
      if (dias[i] !== dias[i-1] + 1) {
        return false;
      }
    }
    return true;
  }

}


