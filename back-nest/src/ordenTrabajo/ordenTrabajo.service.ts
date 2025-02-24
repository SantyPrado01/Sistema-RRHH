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

  async createOrdenTrabajo(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo> {
    const { servicio, empleadoAsignado, mes, anio, diaEspecifico, horaInicio, horaFin } = createOrdenTrabajoDto;

    const empleadoExistente = await this.empleadoRepository.findOne({ where: { Id: empleadoAsignado.Id } });
    if (!empleadoExistente) throw new NotFoundException('Empleado no encontrado');

    const servicioExistente = await this.servicioRepository.findOne({ where: { servicioId: servicio.servicioId } });
    if (!servicioExistente) throw new NotFoundException('Servicio no encontrado');

    let mesExtraido = mes;
    let anioExtraido = anio;
    console.log(mesExtraido)
    if (diaEspecifico){
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
  
  async createNecesidadHoraria(ordenTrabajoId: number, necesidadesHorarias: CreateNecesidadHorariaDto[]): Promise<NecesidadHoraria[]> {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({ where: { Id: ordenTrabajoId }, relations: ['empleadoAsignado'] });
    if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');

    const empleado = ordenTrabajo.empleadoAsignado;

    if (empleado.fulltime) {
        console.log('Orden de Trabajo ID:', ordenTrabajoId);
        const nuevasNecesidades = necesidadesHorarias.map((necesidad) =>
            this.necesidadHorariaRepository.create({
                ...necesidad,
                ordenTrabajo,
            })
        );
        return this.necesidadHorariaRepository.save(nuevasNecesidades);
    }

    const disponibilidades = empleado.disponibilidades;
    console.log(disponibilidades);

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
              const [horaInicioProyectado, minutoInicioProyectado] = horario.horaInicioProyectado.split(":");
              const [horaFinProyectado, minutoFinProyectado] = horario.horaFinProyectado.split(":");
        
              const horaInicio = new Date();
              horaInicio.setHours(parseInt(horaInicioProyectado), parseInt(minutoInicioProyectado), 0, 0);
        
              const horaFin = new Date();
              horaFin.setHours(parseInt(horaFinProyectado), parseInt(minutoFinProyectado), 0, 0);

              let horas = (horaFin.getTime() - horaInicio.getTime()) / 3600000; 

              if (horas < 0) {
                horas += 24; 
              }
              horasProyectadas += horas;
            }
  
            // Calcular horas reales
            if (horario.horaInicioReal && horario.horaFinReal) {
              const [horaRealInicio, minutoRealInicio] = horario.horaInicioReal.split(":");
              const [horaRealFin, minutoRealFin] = horario.horaFinReal.split(":");
        
              const horaRealInicioDate = new Date();
              horaRealInicioDate.setHours(parseInt(horaRealInicio), parseInt(minutoRealInicio), 0, 0);
        
              const horaRealFinDate = new Date();
              horaRealFinDate.setHours(parseInt(horaRealFin), parseInt(minutoRealFin), 0, 0);
        
              // Calcular horas reales en decimal
              const horasRealesCalculadas = (horaRealFinDate.getTime() - horaRealInicioDate.getTime()) / 3600000; 

              if (horasRealesCalculadas < 0) {
                horasReales += 24; 
              }

              horasReales += horasRealesCalculadas;
            }
          });
        } else {// Para las ordenes con `diaEspecifico`

          if (orden.horaInicio && orden.horaFin) {
            const horarioAsignado = orden.horariosAsignados[0];
            console.log(horarioAsignado);
  
            const comprobado = horarioAsignado ? horarioAsignado.comprobado : false;
  
            if (comprobado === true) {
              orden.completado = true;
              await this.ordenTrabajoRepository.save(orden);
            }
  
            // Convertir las horas proyectadas
            const [horaInicio, minutoInicio] = orden.horaInicio.split(':');
            const [horaFin, minutoFin] = orden.horaFin.split(':');
  
            const horaInicioDate = new Date(orden.diaEspecifico);
            horaInicioDate.setHours(parseInt(horaInicio), parseInt(minutoInicio), 0, 0);
  
            const horaFinDate = new Date(orden.diaEspecifico);
            horaFinDate.setHours(parseInt(horaFin), parseInt(minutoFin), 0, 0);
  
            // Calcular horas proyectadas en formato decimal
            const diferenciaMillis = horaFinDate.getTime() - horaInicioDate.getTime();
            const horasProyectadasDecimal = diferenciaMillis / 3600000;
            
            horasReales = horasProyectadas;
          }
        }
        // Función para convertir horas decimales a formato HH:mm
        function convertirAHorasYMinutos(decimales: number): string {
          const horas = Math.floor(decimales); // obtener las horas enteras
          const minutos = Math.round((decimales - horas) * 60); // obtener los minutos restantes
          return `${horas}:${minutos < 10 ? '0' + minutos : minutos}`; // formatear a HH:mm
        }

        // Convertir las horas proyectadas y reales a formato HH:mm
        const horasProyectadasFormateadas = convertirAHorasYMinutos(horasProyectadas);
        const horasRealesFormateadas = convertirAHorasYMinutos(horasReales);

  
        return {
          ...orden,
          horasProyectadasFormateadas,
          horasRealesFormateadas,
        };
      }),
    );
  
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
      // Cálculo de horas proyectadas
      if (horario.horaInicioProyectado && horario.horaFinProyectado) {
        const [horaInicioProyectado, minutoInicioProyectado] = horario.horaInicioProyectado.split(":").map(Number);
        const [horaFinProyectado, minutoFinProyectado] = horario.horaFinProyectado.split(":").map(Number);
  
        const horaInicio = new Date();
        horaInicio.setHours(horaInicioProyectado, minutoInicioProyectado, 0, 0);
  
        const horaFin = new Date();
        horaFin.setHours(horaFinProyectado, minutoFinProyectado, 0, 0);
  
        let horas = (horaFin.getTime() - horaInicio.getTime()) / 3600000; // en horas decimales
  
        // Si las horas calculadas son negativas, significa que cruzó la medianoche
        if (horas < 0) {
          horas += 24; // Ajustar sumando 24 horas
        }
  
        horasProyectadas += horas;

      }
  
      // Cálculo de horas reales
      if (horario.horaInicioReal && horario.horaFinReal) {
        const [horaRealInicio, minutoRealInicio] = horario.horaInicioReal.split(":").map(Number);
        const [horaRealFin, minutoRealFin] = horario.horaFinReal.split(":").map(Number);
  
        const horaRealInicioDate = new Date();
        horaRealInicioDate.setHours(horaRealInicio, minutoRealInicio, 0, 0);
  
        const horaRealFinDate = new Date();
        horaRealFinDate.setHours(horaRealFin, minutoRealFin, 0, 0);
  
        let horasRealesCalculadas = (horaRealFinDate.getTime() - horaRealInicioDate.getTime()) / 3600000;
  
        if (horasRealesCalculadas < 0) {
          horasRealesCalculadas += 24;
        }
  
        horasReales += horasRealesCalculadas;
      }
    });
  
    // Función para convertir horas decimales a formato HH:mm
    function convertirAHorasYMinutos(decimales: number): string {
      const horas = Math.floor(Math.abs(decimales)); // obtener las horas enteras
      const minutos = Math.round((Math.abs(decimales) - horas) * 60); // obtener los minutos restantes
      return `${horas}:${minutos < 10 ? '0' + minutos : minutos}`; // formatear a HH:mm
    }
  
    // Convertir las horas proyectadas y reales a formato HH:mm
    const horasProyectadasFormateadas = convertirAHorasYMinutos(horasProyectadas);
    const horasRealesFormateadas = convertirAHorasYMinutos(horasReales);

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
    console.log('Consulta Orden Trabajo',result)
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