import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenTrabajo } from './entities/ordenTrabajo.entity'; 
import { CreateOrdenTrabajoDto } from './dto/createOrdenTrabajo.dto'; 
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { UpdateOrdenTrabajoDto } from './dto/updateOrdenTrabajo.dto'; 
import { CreateNecesidadHorariaDto } from 'src/necesidadHoraria/dto/createNecesidadHoraria.dto'; 
import { NecesidadHoraria } from 'src/necesidadHoraria/entities/necesidadHoraria.entity'; 
import { HorarioAsignado } from 'src/horariosAsignados/entities/horariosAsignados.entity'; 

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

  // Método para crear una nueva orden de trabajo
  async createOrdenTrabajo(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo> {
    const { servicio, empleadoAsignado, mes, anio } = createOrdenTrabajoDto;

    const empleadoExistente = await this.empleadoRepository.findOne({ where: { Id: empleadoAsignado.Id } });
    if (!empleadoExistente) throw new NotFoundException('Empleado no encontrado');

    const servicioExistente = await this.servicioRepository.findOne({ where: { servicioId: servicio.servicioId } });
    if (!servicioExistente) throw new NotFoundException('Servicio no encontrado');

    const nuevaOrdenTrabajo = this.ordenTrabajoRepository.create({
      servicio: servicioExistente,
      empleadoAsignado: empleadoExistente,
      mes,
      anio
    });
    return this.ordenTrabajoRepository.save(nuevaOrdenTrabajo);
  }

  // Método para agregar necesidades horarias
  async createNecesidadHoraria(
    ordenTrabajoId: number,
    necesidadesHorarias: CreateNecesidadHorariaDto[],
  ): Promise<NecesidadHoraria[]> {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({ where: { Id :ordenTrabajoId } });
    if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');

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
  
    // Filtrar solo las necesidades horarias con horas válidas
    const necesidadesValidas = ordenTrabajo.necesidadHoraria.filter(
      (necesidad) => necesidad.horaInicio && necesidad.horaFin && necesidad.horaInicio !== '00:00:00' && necesidad.horaFin !== '00:00:00'
    );
  
    console.log("Necesidades válidas:", necesidadesValidas); // Verifica que haya datos
  
    for (const necesidad of necesidadesValidas) {
      const fechas = this.obtenerFechasDelMes(ordenTrabajo.anio, ordenTrabajo.mes, necesidad.diaSemana);
      console.log(`Fechas generadas para el día ${necesidad.diaSemana}:`, fechas); // Muestra las fechas generadas
  
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
  
  private obtenerFechasDelMes(anio: number, mes: number, diaSemana: string): Date[] {
    console.log('Funcion Fechas');
    const fechas: Date[] = [];
    const primerDiaMes = new Date(anio, mes - 1, 1); // El primer día del mes
    const ultimoDiaMes = new Date(anio, mes, 0).getDate(); // El último día del mes
    const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
    
    // Convertir '1' a 'lunes'
    const diaIndice = parseInt(diaSemana) - 1; // Ajustar el índice, donde 0 es domingo
  
    // Verificar que el índice de día sea válido (0-6)
    if (diaIndice < 0 || diaIndice > 6) return fechas;
  
    // Iterar sobre todos los días del mes
    for (let dia = 1; dia <= ultimoDiaMes; dia++) {
      const fecha = new Date(anio, mes - 1, dia); // Crear fecha con año, mes y día
      if (fecha.getDay() === diaIndice) {
        fechas.push(fecha); // Si el día coincide, agregar a la lista
      }
    }
    console.log(fechas);
    return fechas;
  }
  
  

  async findAll(): Promise<OrdenTrabajo[]> {
    return this.ordenTrabajoRepository.find({ relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'] });
  }

  async findOne(id: number): Promise<OrdenTrabajo> {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
      where: { Id: id },
      relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'],
    });
    if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');
    return ordenTrabajo;
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
}