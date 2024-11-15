import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';
import { DisponibilidadHorariaService } from 'src/disponibilidad-horaria/disponibilidad-horaria.service';
import { CreateDisponibilidadHorariaDto } from 'src/disponibilidad-horaria/dto/create-disponibilidad-horaria.dto';
import { DisponibilidadHoraria } from 'src/disponibilidad-horaria/entities/disponibilidad-horaria.entity';


@Injectable()
export class EmpleadosService {

  constructor(
  @InjectRepository(Empleado) 
  private empleadoRepository:Repository<Empleado>,
  @InjectRepository(DisponibilidadHoraria)
  private readonly disponibilidadRepository: Repository<DisponibilidadHoraria>
  ){}

  async createEmpleado(createEmpleadoDto: CreateEmpleadoDto): Promise<Empleado> {
    const newEmpleado = this.empleadoRepository.create(createEmpleadoDto);
    const savedEmpleado = await this.empleadoRepository.save(newEmpleado);
    console.log('Empleado creado:', savedEmpleado);
    return savedEmpleado;
  }

  async createDisponibilidad(empleadoId: number, createDisponibilidadHorariaDto: CreateDisponibilidadHorariaDto[]): Promise<DisponibilidadHoraria[]> {
    const diasSemana = [1, 2, 3, 4, 5, 6, 7]; // 1: Lunes, 2: Martes, ..., 7: Domingo

    // Convertimos los días ya definidos en un Set para verificar cuáles faltan
    const diasDefinidos = new Set(createDisponibilidadHorariaDto.map(d => d.diaSemana));

    // Añadimos los días no definidos con horarios vacíos
    for (const dia of diasSemana) {
      if (!diasDefinidos.has(dia)) {
        createDisponibilidadHorariaDto.push({
          empleadoId: empleadoId,
          diaSemana: dia,
          horaInicio: '',
          horaFin: '',
        });
      }
    }

    // Creamos las entidades de disponibilidad horaria a partir del DTO
    const disponibilidades = createDisponibilidadHorariaDto.map(diaSemanaDto => {
      const disponibilidad = new DisponibilidadHoraria();
      disponibilidad.empleadoId = empleadoId;
      disponibilidad.diaSemana = diaSemanaDto.diaSemana;
      disponibilidad.horaInicio = diaSemanaDto.horaInicio;
      disponibilidad.horaFin = diaSemanaDto.horaFin;
      return disponibilidad;
    });

    // Guardamos todas las disponibilidades en la base de datos
    return await this.disponibilidadRepository.save(disponibilidades);
  }
    
  get(){
    return this.empleadoRepository.find({})
  }

  async getId(id: number){
    const empleadoFound = await this.empleadoRepository.findOne({
      where:{
        Id: id
      }
    })
    if (!empleadoFound){
      return new HttpException('Empleado no encontrado', HttpStatus.NOT_FOUND)
    }
    return empleadoFound
  }

  async delete(empleadoId:number){
    const empleadoFound = await this.empleadoRepository.findOne({
      where:{
        Id: empleadoId
      }
    })
    if (!empleadoFound){
      return new HttpException('Empleado no encontrado', HttpStatus.NOT_FOUND)
    }
    empleadoFound.eliminado = true;
    await this.empleadoRepository.save(empleadoFound);
    throw new HttpException('Empleado eliminado.', HttpStatus.ACCEPTED);

  }
  async update(empleadoId:number, empleado: UpdateEmpleadoDto){
    const empleadoFound = await this.empleadoRepository.findOne({
      where:{
        Id:empleadoId
      }
    });
    if(!empleadoFound){
      return new HttpException('Empleado no encontrado', HttpStatus.NOT_FOUND)
    }
    const updateEmpleado = Object.assign(empleadoFound, empleado);
    return this.empleadoRepository.save(updateEmpleado);
  }


}
