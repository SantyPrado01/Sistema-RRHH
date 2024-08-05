import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmpleadosService {

  constructor(@InjectRepository(Empleado) private empleadoRepository:Repository<Empleado>){}

  createEmpleado(Empleado: CreateEmpleadoDto){

    const newEmpleado = this.empleadoRepository.create(Empleado)
    return this.empleadoRepository.save(newEmpleado), new HttpException('El Empleado se guardo con exito', HttpStatus.ACCEPTED)

  }

  getEmpleados(){
    return this.empleadoRepository.find()
  }

  async getEmpleado(id: number){
    const empleadoFound = await this.empleadoRepository.findOne({
      where:{
        id
      }
    })
    if (!empleadoFound){
      return new HttpException('Empleado no encontrado', HttpStatus.NOT_FOUND)
    }
    return empleadoFound
  }

  async deleteEmpleado(id:number){
    const empleadoFound = await this.empleadoRepository.findOne({
      where:{
        id
      }
    })
    if (!empleadoFound){
      return new HttpException('Empleado no encontrado', HttpStatus.NOT_FOUND)
    }
    return this.empleadoRepository.delete({id}), new HttpException('Empleado eliminado con exito', HttpStatus.ACCEPTED)
  }

  async updateEmpleado(id:number, empleado: UpdateEmpleadoDto){
    
    const empleadoFound = this.empleadoRepository.findOne({
      where:{
        id
      }
    });
    if(!empleadoFound){
      return new HttpException('Empleado no encontrado', HttpStatus.NOT_FOUND)
    }
    const updateEmpleado = Object.assign(empleadoFound, empleado);
    return this.empleadoRepository.save(updateEmpleado);
  }


}
