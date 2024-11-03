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
  async create(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo> {
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
  async addNecesidadHoraria(
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

  // Método para asignar horarios en función de las necesidades horarias
  async asignarHorarios(ordenTrabajoId: number) {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
      where: { Id: ordenTrabajoId },
      relations: ['necesidadHoraria', 'empleadoAsignado'],
    });

    if (!ordenTrabajo) throw new NotFoundException('Orden de trabajo no encontrada');

    const horariosAsignados = [];
    for (const necesidad of ordenTrabajo.necesidadHoraria) {
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

    return this.horarioAsignadoRepository.save(horariosAsignados);
  }

  // Método helper para obtener las fechas en el mes de un día específico
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

  // Otros métodos de búsqueda, actualización y eliminación...

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