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
              throw new BadRequestException(`La Necesidad Horaria para el dia ${diaSemana} no esta completamente dentro de la disponibilidad del empleado.`);
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


  
  /**
 * Verifica si un horario solicitado está dentro del rango de disponibilidad del empleado.
 */

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


  async createAsignarHorarioUnico(ordenTrabajoId: number, diaEspecifico: Date, horaInicio: string, horaFin: string) {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
      where: { Id: ordenTrabajoId },
      relations: ['empleadoAsignado'],
    });
    if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');
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
  
  async createAsignarHorarios(ordenTrabajoId: number) {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({where: { Id: ordenTrabajoId }, relations: ['necesidadHoraria', 'empleadoAsignado']});
    if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');
    const horariosAsignados = [];
    const necesidadesValidas = ordenTrabajo.necesidadHoraria.filter(
      (necesidad) => necesidad.horaInicio && necesidad.horaFin && necesidad.horaInicio !== '00:00:00' && necesidad.horaFin !== '00:00:00'
    );
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
  
  async findAll(): Promise<any[]> {
    const ordenes = await this.ordenTrabajoRepository.find({
      relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
    });

    const result = await Promise.all(
      ordenes.map(async (orden) => {
        let horasProyectadas = 0;
        let horasReales = 0;

        if (orden.diaEspecifico === null) {
          const todosComprobados = orden.horariosAsignados.every(
            (horario) => horario.comprobado === true,
          );

          if (todosComprobados) {
            orden.completado = true;
            await this.ordenTrabajoRepository.save(orden);
          }

          orden.horariosAsignados.forEach((horario) => {
            if (horario.horaInicioProyectado && horario.horaFinProyectado) {
              horasProyectadas += this.calcularHoras(horario.horaInicioProyectado, horario.horaFinProyectado);
            }

            if (horario.horaInicioReal && horario.horaFinReal) {
              horasReales += this.calcularHoras(horario.horaInicioReal, horario.horaFinReal);
            }
          });
        } else {
          if (orden.horaInicio && orden.horaFin) {
            const horarioAsignado = orden.horariosAsignados[0];
            const comprobado = horarioAsignado ? horarioAsignado.comprobado : false;

            if (comprobado === true) {
              orden.completado = true;
              await this.ordenTrabajoRepository.save(orden);
            }

            horasProyectadas = this.calcularHoras(orden.horaInicio, orden.horaFin);
            horasReales = horasProyectadas;
          }
        }
        const horasProyectadasFormateadas = this.convertirAHorasYMinutos(horasProyectadas);
        const horasRealesFormateadas = this.convertirAHorasYMinutos(horasReales);

        return {
          ...orden,
          horasProyectadas: horasProyectadasFormateadas,
        horasReales: horasRealesFormateadas,
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

      const horasProyectadasFormateadas = this.convertirAHorasYMinutos(horasProyectadas);
      const horasRealesFormateadas = this.convertirAHorasYMinutos(horasReales);

      return {
        ...orden,
        horasProyectadas: horasProyectadasFormateadas,
        horasReales: horasRealesFormateadas,
      };
    }
    );
    return ordenesProcesadas;

  }

  async findForEmpleado(empleadoId: number): Promise<any> {
    const ordenes = await this.ordenTrabajoRepository.find({
      where: {empleadoAsignado: { Id: empleadoId }},
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