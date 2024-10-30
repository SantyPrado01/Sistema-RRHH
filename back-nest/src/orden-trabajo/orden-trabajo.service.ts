import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenTrabajo } from './entities/orden-trabajo.entity'; 
import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto';  
import { Empleado } from 'src/empleados/entities/empleado.entity'; 
import { Servicio } from 'src/servicios/entities/servicio.entity'; 
import { UpdateOrdenTrabajoDto } from './dto/update-orden-trabajo.dto';

@Injectable()
export class OrdenTrabajoService {
  constructor(
    @InjectRepository(OrdenTrabajo)
    private readonly ordenTrabajoRepository: Repository<OrdenTrabajo>,
    @InjectRepository(Empleado)
    private readonly empleadoRepository: Repository<Empleado>,
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,

  ) {}

async create(createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo> {
  const { servicio, empleadoAsignado, mes, anio } = createOrdenTrabajoDto;

  const empleadoExistente = await this.empleadoRepository.findOne({ where: { empleadoId: empleadoAsignado.empleadoId } });
  if (!empleadoExistente) {
      throw new NotFoundException('Empleado no encontrado');
  }

  const servicioExistente = await this.servicioRepository.findOne({ where: { servicioId: servicio.servicioId } });
  if (!servicioExistente) {
      throw new NotFoundException('Servicio no encontrado');
  }

  const nuevaOrdenTrabajo = this.ordenTrabajoRepository.create({
      servicio: servicioExistente,
      empleadoAsignado: empleadoExistente,
      mes,
      anio
  });

  const ordenTrabajoGuardada = await this.ordenTrabajoRepository.save(nuevaOrdenTrabajo);

  return ordenTrabajoGuardada;
}


  async findAll(): Promise<OrdenTrabajo[]> {
    return this.ordenTrabajoRepository.find({ relations: ['servicio', 'empleadoAsignado', 'horariosAsignados'] });
  }

  async findOne(id: number): Promise<OrdenTrabajo> {
    const ordenTrabajo = await this.ordenTrabajoRepository.findOne({
      where: { ordenTrabajoId: id }, // Asumiendo que el nombre de la propiedad de ID es `ordenTrabajoId`
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

    if (updateOrdenTrabajoDto.empleadoAsignado.empleadoId) {
      const empleado = await this.empleadoRepository.findOne({
        where:{empleadoId:updateOrdenTrabajoDto.empleadoAsignado.empleadoId}
      });
      if (!empleado) throw new NotFoundException('Empleado no encontrado');
      ordenTrabajo.empleadoAsignado = empleado;
    }

    Object.assign(ordenTrabajo, updateOrdenTrabajoDto);

    // Manejar horarios asignados (opcional: aquí puedes actualizar horarios si fuera necesario)

    return this.ordenTrabajoRepository.save(ordenTrabajo);
  }

  async remove(id: number): Promise<void> {
    const result = await this.ordenTrabajoRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Orden de trabajo no encontrada');
  }
}
