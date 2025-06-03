import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';
import { CreateDisponibilidadHorariaDto } from 'src/disponibilidad-horaria/dto/create-disponibilidad-horaria.dto';
import { DisponibilidadHoraria } from 'src/disponibilidad-horaria/entities/disponibilidad-horaria.entity';
import { UpdateDisponibilidadHorariaDto } from 'src/disponibilidad-horaria/dto/update-disponibilidad-horaria.dto';
import { ILike } from 'typeorm';



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

  async createDisponibilidad(
    empleadoId: number,
    createDisponibilidadHorariaDto: CreateDisponibilidadHorariaDto[],
  ): Promise<DisponibilidadHoraria[]> {
    if (!createDisponibilidadHorariaDto) {
      createDisponibilidadHorariaDto = [];
    }
    const diasSemana = [1, 2, 3, 4, 5, 6, 7];
    const diasDefinidos = new Set(createDisponibilidadHorariaDto.map(d => d.diaSemana));

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
    const disponibilidades = createDisponibilidadHorariaDto.map(diaSemanaDto => {
      const disponibilidad = new DisponibilidadHoraria();
      disponibilidad.empleadoId = empleadoId; 
      disponibilidad.diaSemana = diaSemanaDto.diaSemana;
      disponibilidad.horaInicio = diaSemanaDto.horaInicio;
      disponibilidad.horaFin = diaSemanaDto.horaFin;
      return disponibilidad;
    });
    return await this.disponibilidadRepository.save(disponibilidades);
  }
  
    
  get(){
    return this.empleadoRepository.find()
  }

  getEmpleados(){
    return this.empleadoRepository.find({where:{eliminado:false}})
  }

  async getId(id: number){
    const empleadoFound = await this.empleadoRepository.findOne({
      where:{Id: id},
      relations:['categoria']
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

  async updateDisponibilidad(empleadoId: number, updateDisponibilidadDto: UpdateDisponibilidadHorariaDto[]): Promise<any> {
    const empleado = await this.empleadoRepository.findOne({
      where: { Id: empleadoId },
      relations: ['disponibilidades'], 
    });
    console.log('Este es el empleado antes del update',empleado)
    if (!empleado) {
      throw new Error('Empleado no encontrado.');
    }

    for (const disponibilidad of empleado.disponibilidades) {
      const disponibilidadDto = updateDisponibilidadDto.find(
        (item) => item.disponibilidadHorariaId === disponibilidad.disponibilidadHorariaId
      );
  
      if (disponibilidadDto) {
        if (disponibilidadDto.horaInicio) disponibilidad.horaInicio = disponibilidadDto.horaInicio;
        if (disponibilidadDto.horaFin) disponibilidad.horaFin = disponibilidadDto.horaFin;
        if (disponibilidadDto.diaSemana) disponibilidad.diaSemana = disponibilidadDto.diaSemana;
      }

      disponibilidad.empleadoId = empleadoId;  
    }
    await this.disponibilidadRepository.save(empleado.disponibilidades);
    console.log('Estas son las disponibilidades al guardar', empleado.disponibilidades)
    return { message: 'Disponibilidades actualizadas con éxito' };
  }

  async buscarPorNombre(termino: string): Promise<Empleado[]> {
    return this.empleadoRepository.find({
      where: [ // Usamos un array para las condiciones OR
        {
          nombre: ILike(`%${termino}%`),
          eliminado: false,
        },
        {
          apellido: ILike(`%${termino}%`),
          eliminado: false,
        },
      ],
      take: 6, // <-- opcional: limita la cantidad de resultados
    });
  }
  
  
  
}
