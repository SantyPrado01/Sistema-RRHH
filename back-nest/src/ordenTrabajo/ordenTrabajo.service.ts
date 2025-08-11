import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { OrdenTrabajo } from './entities/ordenTrabajo.entity'; 
import { CreateOrdenTrabajoDto } from './dto/createOrdenTrabajo.dto'; 
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { UpdateOrdenTrabajoDto } from './dto/updateOrdenTrabajo.dto'; 
import { CreateNecesidadHorariaDto } from 'src/necesidadHoraria/dto/createNecesidadHoraria.dto'; 
import { NecesidadHoraria } from 'src/necesidadHoraria/entities/necesidadHoraria.entity'; 
import { HorarioAsignado } from 'src/horariosAsignados/entities/horariosAsignados.entity'; 
import { OrdenTrabajoConHoras } from './interface/orden-trabajo-con-horas.interface';
import { Cron, CronExpression } from '@nestjs/schedule';

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

  /*Renovacion automaticas de las ordenes de trabajo*/
  /*@Cron('0 25 23 * * 6') 
  async ejecutarRenovacionProgramada(): Promise<void> {
    try {
      console.log('🕐 Verificando si es el antepenúltimo viernes del mes...');
      
      if (this.esAntepenultimoViernes()) {
        console.log('✅ Es el antepenúltimo viernes del mes. Ejecutando renovación automática...');
        
        const ordenesRenovadas = await this.renovacionAutomatica();
        
        console.log(`🎉 Renovación automática completada. ${ordenesRenovadas.length} órdenes renovadas.`);
  
        
      } else {
        console.log('ℹ️ No es el antepenúltimo viernes del mes. No se ejecuta renovación.');
      }
    } catch (error) {
      console.error('❌ Error en la ejecución programada de renovación automática:', error);
    }
  }
  */

    /*Determina si la fecha actual es el antepenúltimo viernes del mes*/
  private esAntepenultimoViernes(): boolean {
    const hoy = new Date();
    
    // Verificar que sea viernes (día 5)
    if (hoy.getDay() !== 5) {
      return false;
    }
    
    // Obtener todos los viernes del mes actual
    const viernesDelMes = this.obtenerViernesDelMes(hoy.getFullYear(), hoy.getMonth());
    
    // Verificar que haya al menos 3 viernes en el mes
    if (viernesDelMes.length < 3) {
      return false;
    }
    
    // El antepenúltimo viernes es el tercero desde el final
    const antepenultimoViernes = viernesDelMes[viernesDelMes.length - 3];
    
    // Comparar fechas (solo día, mes y año)
    return hoy.getDate() === antepenultimoViernes.getDate() &&
           hoy.getMonth() === antepenultimoViernes.getMonth() &&
           hoy.getFullYear() === antepenultimoViernes.getFullYear();
  }

    /*Obtiene todos los viernes de un mes específico*/
  private obtenerViernesDelMes(anio: number, mes: number): Date[] {
    const viernes: Date[] = [];
    const fecha = new Date(anio, mes, 1);
    
    // Encontrar el primer viernes del mes
    while (fecha.getDay() !== 5) {
      fecha.setDate(fecha.getDate() + 1);
    }
    
    // Agregar todos los viernes del mes
    while (fecha.getMonth() === mes) {
      viernes.push(new Date(fecha));
      fecha.setDate(fecha.getDate() + 7); // Siguiente viernes
    }
    
    return viernes;
  }

    /*Función auxiliar para ejecutar manualmente la renovación (para testing)*/
  async ejecutarRenovacionManual(): Promise<OrdenTrabajo[]> {
    console.log('🔧 Ejecutando renovación manual...');
    return await this.renovacionAutomatica();
  }

    /*Función auxiliar para verificar cuándo será el próximo antepenúltimo viernes*/
  obtenerProximoAntepenultimoViernes(): Date | null {
    const hoy = new Date();
    let mesActual = hoy.getMonth();
    let anioActual = hoy.getFullYear();
    
    // Verificar el mes actual
    const viernesEsteMes = this.obtenerViernesDelMes(anioActual, mesActual);
    if (viernesEsteMes.length >= 3) {
      const antepenultimoEsteMes = viernesEsteMes[viernesEsteMes.length - 3];
      if (antepenultimoEsteMes >= hoy) {
        return antepenultimoEsteMes;
      }
    }
    
    // Si no hay en el mes actual, buscar en el siguiente
    mesActual++;
    if (mesActual > 11) {
      mesActual = 0;
      anioActual++;
    }
    
    const viernesSiguienteMes = this.obtenerViernesDelMes(anioActual, mesActual);
    if (viernesSiguienteMes.length >= 3) {
      return viernesSiguienteMes[viernesSiguienteMes.length - 3];
    }
    
    return null;
  }

  async renovacionAutomatica(): Promise<OrdenTrabajo[]> {
  // Buscar todas las órdenes con renovación automática activada
  const ordenesConRenovacion = await this.ordenTrabajoRepository.find({
    where: { renovacionAutomatica: true },
    relations: ['servicio', 'empleadoAsignado', 'necesidadHoraria', 'empleadoAsignado.disponibilidades']
  });

  if (ordenesConRenovacion.length === 0) {
    console.log('No hay órdenes con renovación automática activada');
    return [];
  }

  const ordenesRenovadas: OrdenTrabajo[] = [];

  for (const ordenOriginal of ordenesConRenovacion) {
    try {
      // Calcular el mes siguiente
      const mesActual = ordenOriginal.mes;
      const anioActual = ordenOriginal.anio;
      
      let mesSiguiente = mesActual + 1;
      let anioSiguiente = anioActual;
      
      // Si pasamos de diciembre, ir a enero del siguiente año
      if (mesSiguiente > 12) {
        mesSiguiente = 1;
        anioSiguiente = anioActual + 1;
      }

      // Verificar si ya existe una orden para ese mes y año
      const ordenExistente = await this.ordenTrabajoRepository.findOne({
        where: {
          mes: mesSiguiente,
          anio: anioSiguiente,
          servicio: { servicioId: ordenOriginal.servicio.servicioId },
          empleadoAsignado: { Id: ordenOriginal.empleadoAsignado.Id }
        }
      });

      if (ordenExistente) {
        console.log(`Ya existe una orden para el mes ${mesSiguiente}/${anioSiguiente} - Orden ID: ${ordenExistente.Id}`);
        continue;
      }

      // Calcular las fechas del mes siguiente
      const fechaInicioMesSiguiente = new Date(anioSiguiente, mesSiguiente - 1, 1);
      const fechaFinMesSiguiente = new Date(anioSiguiente, mesSiguiente, 0); // Último día del mes

      console.log(`Creando orden renovada para ${mesSiguiente}/${anioSiguiente}`);
      console.log(`Fecha inicio: ${fechaInicioMesSiguiente}, Fecha fin: ${fechaFinMesSiguiente}`);

      // Crear la nueva orden de trabajo
      const nuevaOrdenTrabajo = this.ordenTrabajoRepository.create({
        servicio: ordenOriginal.servicio,
        empleadoAsignado: ordenOriginal.empleadoAsignado,
        mes: mesSiguiente,
        anio: anioSiguiente,
        fechaInicio: fechaInicioMesSiguiente,
        fechaFin: fechaFinMesSiguiente,
        renovacionAutomatica: ordenOriginal.renovacionAutomatica, // Mantener el estado
        completado: false,
        eliminado: false
      });

      const ordenGuardada = await this.ordenTrabajoRepository.save(nuevaOrdenTrabajo);
      ordenesRenovadas.push(ordenGuardada);

      // Obtener las necesidades horarias de la orden original
      const necesidadesOriginales = ordenOriginal.necesidadHoraria;

      if (necesidadesOriginales && necesidadesOriginales.length > 0) {
        // Filtrar solo las necesidades horarias que tienen horarios válidos (no 00:00:00)
        const necesidadesValidas = necesidadesOriginales.filter(necesidad => 
          necesidad.horaInicio && 
          necesidad.horaFin && 
          necesidad.horaInicio !== '00:00:00' && 
          necesidad.horaFin !== '00:00:00'
        );

        if (necesidadesValidas.length > 0) {
          // Crear objetos de necesidades horarias sin la relación a la orden anterior
          const necesidadesParaNuevaOrden = necesidadesValidas.map(necesidad => ({
            diaSemana: necesidad.diaSemana,
            horaInicio: necesidad.horaInicio,
            horaFin: necesidad.horaFin
          }));

          // Crear las necesidades horarias para la nueva orden
          await this.createNecesidadHoraria(ordenGuardada.Id, necesidadesParaNuevaOrden);

          // Crear los horarios asignados para la nueva orden
          await this.createHorariosParaOrden(
            ordenGuardada,
            necesidadesParaNuevaOrden,
            fechaInicioMesSiguiente,
            fechaFinMesSiguiente
          );

          // Desactivar renovación automática en la orden original
          ordenOriginal.renovacionAutomatica = false;
          await this.ordenTrabajoRepository.save(ordenOriginal);

          console.log(`✅ Orden renovada creada exitosamente - ID: ${ordenGuardada.Id}`);
          console.log(`🔄 Renovación automática desactivada en orden original - ID: ${ordenOriginal.Id}`);
          console.log(`📅 Se crearon horarios para ${necesidadesParaNuevaOrden.length} días de la semana`);
        } else {
          console.log(`⚠️ No se encontraron necesidades horarias válidas para la orden ${ordenOriginal.Id}`);
        }
      } else {
        console.log(`⚠️ No se encontraron necesidades horarias para la orden ${ordenOriginal.Id}`);
      }

    } catch (error) {
      console.error(`Error al renovar la orden ${ordenOriginal.Id}:`, error);
      // Continuar con las siguientes órdenes
    }
  }

  return ordenesRenovadas;
  }

  /*Crear ordenes de trabajo*/

  async createOrdenesTrabajo(
    createOrdenTrabajoDto: CreateOrdenTrabajoDto, 
    fechaDesde: string, 
    fechaHasta: string
    ): Promise<OrdenTrabajo[]> {
    const { servicio, empleadoAsignado, necesidadHoraria } = createOrdenTrabajoDto;

    const empleadoExistente = await this.empleadoRepository.findOne({ where: { Id: empleadoAsignado.Id } });
    if (!empleadoExistente) throw new NotFoundException('Empleado no encontrado');

    const servicioExistente = await this.servicioRepository.findOne({ where: { servicioId: servicio.servicioId } });
    if (!servicioExistente) throw new NotFoundException('Servicio no encontrado');

    // Convertimos las fechas a objetos Date
    const inicio = new Date(`${fechaDesde}T00:00:00`);
    const fin = new Date(`${fechaHasta}T00:00:00`);

    console.log('Fecha Inicio:', inicio);
    console.log('Fecha Fin:', fin);

    const ordenesTrabajo: OrdenTrabajo[] = [];

    // Iteramos mes por mes dentro del rango
    let fechaIterativa = new Date(inicio);
    console.log('Fecha Iterativa:', fechaIterativa);

    while (fechaIterativa <= fin) {
        console.log('Estas en el while');
        const mes = fechaIterativa.getMonth() + 1; // +1 porque getMonth() es base 0
        console.log('Mes:', mes);
        const anio = fechaIterativa.getFullYear();

        const nuevaOrdenTrabajo = this.ordenTrabajoRepository.create({
            servicio: servicioExistente,
            empleadoAsignado: empleadoExistente,
            mes,
            anio,
            fechaInicio: inicio,
            fechaFin: fin,
        });

        const ordenGuardada = await this.ordenTrabajoRepository.save(nuevaOrdenTrabajo);
        ordenesTrabajo.push(ordenGuardada);

        // **Crear las necesidades horarias para esta orden de trabajo**
        await this.createNecesidadHoraria(ordenGuardada.Id, necesidadHoraria);

        // **Asignar los horarios según las necesidades horarias** dentro del rango de fechas
        await this.createHorariosParaOrden(ordenGuardada, necesidadHoraria, inicio, fin);

        // Avanzamos al siguiente mes
        fechaIterativa.setMonth(fechaIterativa.getMonth() + 1);
    }

    return ordenesTrabajo;
  }

  async createNecesidadHoraria(ordenTrabajoId: number, necesidadesHorarias: CreateNecesidadHorariaDto[]): Promise<NecesidadHoraria[]> {
  const ordenTrabajo = await this.ordenTrabajoRepository.findOne({ where: { Id: ordenTrabajoId }, relations: ['empleadoAsignado'] });
  if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');

  const empleado = ordenTrabajo.empleadoAsignado;

  if (empleado.fulltime) {
      const nuevasNecesidades = necesidadesHorarias.map((necesidad) =>
          this.necesidadHorariaRepository.create({
              ...necesidad,
              ordenTrabajo,
          })
      );
      return this.necesidadHorariaRepository.save(nuevasNecesidades);
  }

  const disponibilidades = empleado.disponibilidades;

  const esValida = (horaInicioNecesidad: string, horaFinNecesidad: string, horaInicioDisponibilidad: string, horaFinDisponibilidad: string): boolean => {
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
              throw new BadRequestException(`La necesidad horaria para el dia ${diaSemana} no esta completamente dentro de la disponibilidad del empleado.`);
          }
      } else {
          console.log(`No hay disponibilidad para el día ${diaSemana}, pero no se valida.`);
      }
  }
  const nuevasNecesidades = necesidadesHorarias.map((necesidad) =>
      this.necesidadHorariaRepository.create({
          ...necesidad,
          ordenTrabajo,
      })
  );
  return this.necesidadHorariaRepository.save(nuevasNecesidades);
  }

  async createHorariosParaOrden(
    ordenTrabajo: OrdenTrabajo, 
    horarios: { diaSemana: number, horaInicio: string, horaFin: string }[], 
    fechaDesde: Date, 
    fechaHasta: Date
  ) {
    const empleado = ordenTrabajo.empleadoAsignado;
    const horariosAsignados = [];

    const inicio = new Date(fechaDesde);
    const fin = new Date(fechaHasta);

    // Comparamos las fechas con .getTime() para obtener el valor en milisegundos
    const inicioTime = inicio.getTime();
    const finTime = fin.getTime();
  
    for (const horario of horarios) {
        const { diaSemana, horaInicio, horaFin } = horario;

        if (!horaInicio || !horaFin) {
            console.log(`⚠️ Horario ignorado para el día ${diaSemana} porque falta horaInicio (${horaInicio || 'vacío'}) o horaFin (${horaFin || 'vacío'})`);
            continue;
        }
    
        const fechas = this.obtenerFechasDelMes(ordenTrabajo.anio, ordenTrabajo.mes, diaSemana.toString());
        console.log(`Fechas generadas para el día ${diaSemana}:`, fechas);
  
        for (const fecha of fechas) {
            // Asegúrate de comparar solo las fechas sin tener en cuenta la hora
            const fechaSoloDia = new Date(fecha);
            const fechaSoloDiaTime = fechaSoloDia.getTime();

            console.log('La fecha es:', fechaSoloDia)

            // Comparar las fechas con getTime() en lugar de los objetos Date directamente
            if (fechaSoloDiaTime >= inicioTime && fechaSoloDiaTime <= finTime) {
                
                console.log(`Fecha válida: ${fechaSoloDia}`);

                if (!empleado.fulltime) {
                    const disponibilidadEmpleado = empleado.disponibilidades.find(d => d.diaSemana === diaSemana);
                    if (!disponibilidadEmpleado || !this.validarDisponibilidad(horaInicio, horaFin, disponibilidadEmpleado.horaInicio, disponibilidadEmpleado.horaFin)) {
                        console.log(`Horario ${horaInicio} - ${horaFin} no disponible para el empleado en ${fechaSoloDia}`);
                        continue;
                    }
                }
                const fechaISO = fechaSoloDia.toISOString();
                
                const horarioAsignado = this.horarioAsignadoRepository.create({
                    ordenTrabajo,
                    empleado,
                    fecha: fechaISO,
                    horaInicioProyectado: horaInicio,
                    horaFinProyectado: horaFin,
                    estado: 'Pendiente',
                    suplente: false,
                    empleadoSuplente: null,
                });

                horariosAsignados.push(horarioAsignado);
            }
        }
    }

    if (horariosAsignados.length > 0) {
        await this.horarioAsignadoRepository.save(horariosAsignados);
    } else {
        console.log('No se asignaron horarios dentro del rango especificado.');
    }
  }

  /*Verifica si un horario solicitado está dentro del rango de disponibilidad del empleado*/

  private validarDisponibilidad=(
    horaInicioNecesidad: string, 
    horaFinNecesidad: string, 
    horaInicioDisponibilidad: string, 
    horaFinDisponibilidad: string
): boolean => {
    const inicioNecesidad = new Date(`1970-01-01T${horaInicioNecesidad}Z`);
    const finNecesidad = new Date(`1970-01-01T${horaFinNecesidad}Z`);
    const inicioDisponibilidad = new Date(`1970-01-01T${horaInicioDisponibilidad}Z`);
    const finDisponibilidad = new Date(`1970-01-01T${horaFinDisponibilidad}Z`);

    const esValida = inicioNecesidad >= inicioDisponibilidad && finNecesidad <= finDisponibilidad;
    console.log(`Validación horario (${horaInicioNecesidad}-${horaFinNecesidad}): ${esValida}`);
    return esValida;
  }
  
  private obtenerFechasDelMes(anio: number, mes: number, diaSemana: string): Date[] {
    console.log('Funcion Fechas');
    const fechas: Date[] = [];
    const primerDiaMes = new Date(anio, mes - 1, 1); 
    const ultimoDiaMes = new Date(anio, mes, 0).getDate(); 

    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    
    const diaIndice = parseInt(diaSemana);  
    console.log(diaIndice); 
  
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

  private calcularHoras(horaInicio: string, horaFin: string): number {
    const [inicioHora, inicioMinuto] = horaInicio.split(':').map(Number);
    const [finHora, finMinuto] = horaFin.split(':').map(Number);
    const inicio = new Date();
    inicio.setHours(inicioHora, inicioMinuto, 0, 0);
    const fin = new Date();
    fin.setHours(finHora, finMinuto, 0, 0);

    let diferenciaHoras = (fin.getTime() - inicio.getTime()) / 3600000;
    if (diferenciaHoras < 0) {
      diferenciaHoras += 24; // Ajuste para horarios nocturnos que cruzan la medianoche
    }
    return diferenciaHoras;
  }

  private convertirAHorasYMinutos(decimales: number): string {
    const horas = Math.floor(Math.abs(decimales)); // obtener las horas enteras
    const minutos = Math.round((Math.abs(decimales) - horas) * 60); // obtener los minutos restantes
    return `${horas}:${minutos < 10 ? '0' + minutos : minutos}`; // formatear a HH:mm
  }

  /*Funciones para buscar ordenes de trabajo*/ 

  async findAll(): Promise<any[]> {
  const ordenes = await this.ordenTrabajoRepository.find({
    relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
  });

  const result = await Promise.all(
    ordenes.map(async (orden) => {
      let horasProyectadas = 0;
      let horasReales = 0;

      // Calcular fechaInicio y fechaFin
      let fechaInicio: Date | null = null;
      let fechaFin: Date | null = null;

      if (orden.horariosAsignados && orden.horariosAsignados.length > 0) {
        const fechas = orden.horariosAsignados
          .map((h) => h.fecha)
          .filter((f) => f !== undefined && f !== null)
          .map((f) => new Date(f));

        if (fechas.length > 0) {
          fechaInicio = new Date(Math.min(...fechas.map((f) => f.getTime())));
          fechaFin = new Date(Math.max(...fechas.map((f) => f.getTime())));
        }

        // Verificar si todos los horarios están comprobados
        const todosComprobados = orden.horariosAsignados.every(
          (horario) => horario.comprobado === true,
        );

        if (todosComprobados) {
          orden.completado = true;
          await this.ordenTrabajoRepository.save(orden);
        }

        // Calcular horas proyectadas y reales
        orden.horariosAsignados.forEach((horario) => {
          if (horario.horaInicioProyectado && horario.horaFinProyectado) {
            horasProyectadas += this.calcularHoras(
              horario.horaInicioProyectado,
              horario.horaFinProyectado
            );
          }

          if (horario.horaInicioReal && horario.horaFinReal) {
            horasReales += this.calcularHoras(
              horario.horaInicioReal,
              horario.horaFinReal
            );
          }
        });
      }

      const horasProyectadasFormateadas = this.convertirAHorasYMinutos(horasProyectadas);
      const horasRealesFormateadas = this.convertirAHorasYMinutos(horasReales);

      return {
        ...orden,
        horasProyectadas: horasProyectadasFormateadas,
        horasReales: horasRealesFormateadas,
        fechaInicio,
        fechaFin,
      };
    }),
  );

  return result;
  }

  async findOne(id: number): Promise<OrdenTrabajoConHoras> {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
      where: { Id: id },
      relations: ['servicio', 'empleadoAsignado', 'horariosAsignados', 'horariosAsignados.empleadoSuplente'],
    });
  
    if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');

    ordenTrabajo.horariosAsignados.sort((a, b) => {
      if (a.fecha && b.fecha) {
        return a.fecha.getTime() - b.fecha.getTime();
      }
      // Si alguna de las fechas es null, mantener el orden original o definir un criterio
      return 0;
    })
  
    let horasProyectadas = 0;
    let horasReales = 0;
  
    ordenTrabajo.horariosAsignados.forEach(horario => {
      if (horario.horaInicioProyectado && horario.horaFinProyectado) {
        horasProyectadas += this.calcularHoras(horario.horaInicioProyectado, horario.horaFinProyectado);
      }

      if (horario.horaInicioReal && horario.horaFinReal) {
        horasReales += this.calcularHoras(horario.horaInicioReal, horario.horaFinReal);
      }
    });
  
    const horasProyectadasFormateadas = this.convertirAHorasYMinutos(horasProyectadas);
    const horasRealesFormateadas = this.convertirAHorasYMinutos(horasReales);

    return {
      ...ordenTrabajo,
      horasProyectadas: horasProyectadasFormateadas,
      horasReales: horasRealesFormateadas,
    } as OrdenTrabajoConHoras;
  }
  
  async findMesAnio(mes: number, anio: number): Promise<any> {
  const ordenes = await this.ordenTrabajoRepository.find({
    where: { mes: mes, anio: anio },
    relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
  });

  let totalHorasProyectadas = 0;
  let totalHorasReales = 0;

  const ordenesProcesadas = ordenes.map(orden => {
    let horasProyectadas = 0;
    let horasReales = 0;

    orden.horariosAsignados.forEach(horario => {
      if (horario.horaInicioProyectado && horario.horaFinProyectado) {
        horasProyectadas += this.calcularHoras(horario.horaInicioProyectado, horario.horaFinProyectado);
      }
      if (horario.horaInicioReal && horario.horaFinReal) {
        horasReales += this.calcularHoras(horario.horaInicioReal, horario.horaFinReal);
      }
    });

    // Acumular totales
    totalHorasProyectadas += horasProyectadas;
    totalHorasReales += horasReales;

    const horasProyectadasFormateadas = this.convertirAHorasYMinutos(horasProyectadas);
    const horasRealesFormateadas = this.convertirAHorasYMinutos(horasReales);

    return {
      ...orden,
      horasProyectadas: horasProyectadasFormateadas,
      horasReales: horasRealesFormateadas,
    };
  });

  return {
    ordenes: ordenesProcesadas,
    totales: {
      horasProyectadas: totalHorasProyectadas,
      horasReales:totalHorasReales
    }
  };
}

  async findForEmpleado(
    empleadoId: number
  ): Promise<any> {
    const ordenes = await this.ordenTrabajoRepository.find({
      where: {empleadoAsignado: { Id: empleadoId }},
      relations: ['servicio', 'empleadoAsignado', 'horariosAsignados', 'horariosAsignados.empleadoSuplente', 'horariosAsignados.empleado'],
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

        const esTitular = horario.empleado?.Id && Number(horario.empleado.Id) === Number(empleadoId);
        const esSuplente = horario.empleadoSuplente?.Id && Number(horario.empleadoSuplente.Id) === Number(empleadoId);

        if (esSuplente) {
          if(horario.horaInicioReal && horario.horaFinReal) {
          horasReales += this.calcularHoras(horario.horaInicioReal, horario.horaFinReal);
        }}

        if (esTitular && !horario.empleadoSuplente) {
          if (horario.horaInicioReal && horario.horaFinReal) {
            horasReales += this.calcularHoras(horario.horaInicioReal, horario.horaFinReal);
          }
        }
        if(horario.horaInicioProyectado && horario.horaFinProyectado) {
          horasProyectadas += this.calcularHoras(horario.horaInicioProyectado, horario.horaFinProyectado);  
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
    
      const horasProyectadasFormateadas = this.convertirAHorasYMinutos(horasProyectadas);
      const horasRealesFormateadas = this.convertirAHorasYMinutos(horasReales);

      return {
        ...orden,
        horasProyectadas: horasProyectadasFormateadas,
        horasReales: horasRealesFormateadas,
        estadoContador,
      };
    });
    return result;
  }

  async findForEmpleadoByMonthAndYear(
    empleadoId: number,
    mes: number,
    anio: number
  ): Promise<any> {
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
          horasProyectadas += this.calcularHoras(horario.horaInicioProyectado, horario.horaFinProyectado);
        }

        if (horario.horaInicioReal && horario.horaFinReal) {
          horasReales += this.calcularHoras(horario.horaInicioReal, horario.horaFinReal);
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

      const horasProyectadasFormateadas = this.convertirAHorasYMinutos(horasProyectadas);
      const horasRealesFormateadas = this.convertirAHorasYMinutos(horasReales);

      return {
        ...orden,
        horasProyectadas: horasProyectadasFormateadas,
        horasReales: horasRealesFormateadas,
        estadoContador,
      };
    });
  
    return result;
  }
  
  async findForServicio(servicioId: number): Promise<any> {
    const ordenes = await this.ordenTrabajoRepository.find({
      where: {servicio: { servicioId: servicioId }},
      relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
    });

    const result = ordenes.map(orden => {
      let horasProyectadas = 0;
      let horasReales = 0;

      orden.horariosAsignados.forEach(horario => {
        if (horario.horaInicioProyectado && horario.horaFinProyectado) {
          horasProyectadas += this.calcularHoras(horario.horaInicioProyectado, horario.horaFinProyectado);
        }
        if (horario.horaInicioReal && horario.horaFinReal) {
          horasReales += this.calcularHoras(horario.horaInicioReal, horario.horaFinReal);
        }
      });

      const horasProyectadasFormateadas = this.convertirAHorasYMinutos(horasProyectadas);
      const horasRealesFormateadas = this.convertirAHorasYMinutos(horasReales);

      return {
        ...orden,
        horasProyectadas: horasProyectadasFormateadas,
        horasReales: horasRealesFormateadas,
      };
    });
    return result;
  }

  async findForServicioByMonthAndYear(
    servicioId: number,
    mes: number,
    anio: number
  ): Promise<any> {
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
          horasProyectadas += this.calcularHoras(horario.horaInicioProyectado, horario.horaFinProyectado);
        }

        if (horario.horaInicioReal && horario.horaFinReal) {
          horasReales += this.calcularHoras(horario.horaInicioReal, horario.horaFinReal);
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

      const horasProyectadasFormateadas = this.convertirAHorasYMinutos(horasProyectadas);
      const horasRealesFormateadas = this.convertirAHorasYMinutos(horasReales);

      return {
        ...orden,
        horasProyectadas: horasProyectadasFormateadas,
        horasReales: horasRealesFormateadas,
        estadoContador,
      };
    });
  
    return result;
  }

  async obtenerHorasPorMes(mes: number, anio: number): Promise<any> {
    const ordenes = await this.ordenTrabajoRepository.find({
      where: { mes: mes, anio: anio },
      relations: ['horariosAsignados'],
    });

    let horasProyectadas = 0;
    let horasReales = 0;

    ordenes.forEach((orden) => {
      orden.horariosAsignados.forEach((horario) => {
        if (horario.horaInicioProyectado && horario.horaFinProyectado) {
          horasProyectadas += this.calcularHoras(horario.horaInicioProyectado, horario.horaFinProyectado);
        }
        if (horario.horaInicioReal && horario.horaFinReal) {
          horasReales += this.calcularHoras(horario.horaInicioReal, horario.horaFinReal);
        }
      });
    });

    const horasProyectadasFormateadas = this.convertirAHorasYMinutos(horasProyectadas);
    const horasRealesFormateadas = this.convertirAHorasYMinutos(horasReales);
    
    return {
      horasProyectadas: horasProyectadasFormateadas,
      horasReales: horasRealesFormateadas,
    };
  }

  /*Actualizar ordenes de trabajo */
  
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

  async editarOrdenTrabajo(
    ordenTrabajoId: number, 
    fechaCambio: Date,
    renovacionAutomatica: boolean,
    nuevoEmpleadoId?: number, 
    ): Promise<{ ordenActualizada: OrdenTrabajo, horariosActualizados: number }> {
    console.log('=== INICIO editarEmpleadoOrdenTrabajo ===');
    console.log(`OrdenTrabajo ID: ${ordenTrabajoId}`);
    console.log(`Nuevo Empleado ID: ${nuevoEmpleadoId}`);
    console.log(`Fecha de cambio: ${fechaCambio.toDateString()}`);

    try {
        // 1. Buscar la orden de trabajo
        const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
            where: { Id: ordenTrabajoId },
            relations: ['empleadoAsignado', 'servicio']
        });

        if (!ordenTrabajo) {
            throw new Error(`Orden de trabajo con ID ${ordenTrabajoId} no encontrada`);
        }

        console.log(`✅ Orden encontrada - Empleado actual: ${ordenTrabajo.empleadoAsignado.Id}`);

        // 2. Buscar el nuevo empleado
        const nuevoEmpleado = await this.empleadoRepository.findOne({
            where: { Id: nuevoEmpleadoId },
            relations: ['disponibilidades']
        });

        if (!nuevoEmpleado) {
            throw new Error(`Empleado con ID ${nuevoEmpleadoId} no encontrado`);
        }

        console.log(`✅ Nuevo empleado encontrado: ${nuevoEmpleado.nombre || 'Sin nombre'}`);

        // 3. Actualizar el empleado en la orden de trabajo
        const empleadoAnterior = ordenTrabajo.empleadoAsignado;
        ordenTrabajo.empleadoAsignado = nuevoEmpleado;
        ordenTrabajo.renovacionAutomatica = renovacionAutomatica;

        // Guardar la orden actualizada
        const ordenActualizada = await this.ordenTrabajoRepository.save(ordenTrabajo);
        console.log(`✅ Orden de trabajo actualizada con nuevo empleado`);

        // 4. Buscar horarios asignados posteriores a la fecha de cambio
        const fechaCambioTime = new Date(fechaCambio);
        fechaCambioTime.setHours(0, 0, 0, 0); // Establecer a inicio del día

        console.log(`🔍 Buscando horarios asignados posteriores a: ${fechaCambioTime.toDateString()}`);

        const horariosAsignados = await this.horarioAsignadoRepository.find({
            where: {
                ordenTrabajo: { Id: ordenTrabajoId },
                empleado: { Id: empleadoAnterior.Id } // Buscar por el empleado anterior
            },
            relations: ['empleado', 'ordenTrabajo']
        });

        console.log(`📅 Total horarios encontrados: ${horariosAsignados.length}`);

        // 5. Filtrar horarios posteriores a la fecha de cambio
        const horariosAActualizar = horariosAsignados.filter(horario => {
            const fechaHorario = new Date(horario.fecha);
            fechaHorario.setHours(0, 0, 0, 0); // Establecer a inicio del día
            return fechaHorario >= fechaCambioTime;
        });

        console.log(`📅 Horarios a actualizar: ${horariosAActualizar.length}`);

        // 6. Validar disponibilidad del nuevo empleado (si no es fulltime)
        let horariosValidados = horariosAActualizar;
        
        if (!nuevoEmpleado.fulltime) {
            console.log(`⚠️ Validando disponibilidad del nuevo empleado (no es fulltime)`);
            
            horariosValidados = horariosAActualizar.filter(horario => {
                const fechaHorario = new Date(horario.fecha);
                const diaSemana = fechaHorario.getDay();
                
                const disponibilidad = nuevoEmpleado.disponibilidades.find(d => d.diaSemana === diaSemana);
                
                if (!disponibilidad) {
                    console.log(`❌ Empleado no disponible el día ${diaSemana} para horario ${horario.fecha}`);
                    return false;
                }
                
                const disponible = this.validarDisponibilidad(
                    horario.horaInicioProyectado,
                    horario.horaFinProyectado,
                    disponibilidad.horaInicio,
                    disponibilidad.horaFin
                );
                
                if (!disponible) {
                    console.log(`❌ Horario ${horario.horaInicioProyectado}-${horario.horaFinProyectado} no disponible para empleado en ${horario.fecha}`);
                    return false;
                }
                
                return true;
            });
            
            console.log(`📅 Horarios validados: ${horariosValidados.length} de ${horariosAActualizar.length}`);
        }

        // 7. Actualizar los horarios asignados con el nuevo empleado
        let horariosActualizados = 0;
        
        if (horariosValidados.length > 0) {
            for (const horario of horariosValidados) {
                horario.empleado = nuevoEmpleado;
                
                // Si había un empleado suplente y el horario estaba asignado al empleado original,
                // mantener el suplente pero actualizar el empleado principal
                if (horario.empleadoSuplente && horario.suplente) {
                    console.log(`🔄 Manteniendo suplente en horario ${horario.fecha}`);
                }
                
                console.log(`🔄 Actualizando horario: ${horario.fecha} ${horario.horaInicioProyectado}-${horario.horaFinProyectado}`);
            }
            
            await this.horarioAsignadoRepository.save(horariosValidados);
            horariosActualizados = horariosValidados.length;
            
            console.log(`✅ ${horariosActualizados} horarios actualizados exitosamente`);
        }

        // 8. Log de horarios no actualizados (si los hay)
        const horariosNoActualizados = horariosAActualizar.length - horariosValidados.length;
        if (horariosNoActualizados > 0) {
            console.log(`⚠️ ${horariosNoActualizados} horarios no pudieron ser actualizados debido a falta de disponibilidad del nuevo empleado`);
        }

        console.log('=== FIN editarEmpleadoOrdenTrabajo ===');
        
        return {
            ordenActualizada,
            horariosActualizados
        };

    } catch (error) {
        console.error('❌ Error al editar empleado de orden de trabajo:', error);
        throw error;
    }
  }

  /*Eliminar ordenes de trabajo*/ 

  async deleteOrdenTrabajo(id: number): Promise<void> {

    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
      where:{Id:id},
      relations: ['horariosAsignados', 'necesidadHoraria'],
    });
    if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');

    const horariosAsignados = await this.horarioAsignadoRepository.find({
      where: { ordenTrabajo: { Id: id } },
    });

    for (const horario of horariosAsignados) {
      await this.horarioAsignadoRepository.remove(horario);
    }

    const necesidadesHorarias = await this.necesidadHorariaRepository.find({
      where: { ordenTrabajo: { Id: id } },
    });

    for (const necesidad of necesidadesHorarias) {
      await this.necesidadHorariaRepository.remove(necesidad);
    }

    await this.ordenTrabajoRepository.remove(ordenTrabajo);
  }

  async delete(id: number): Promise<void> {
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
        fecha: MoreThanOrEqual(fechaEliminacion), 
      },
    });

    for (const horario of horariosAsignados) {
      horario.eliminado = true;
      horario.estado = 'Eliminado';
      await this.horarioAsignadoRepository.save(horario);
    }
  }

}