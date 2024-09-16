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
    console.log(Empleado)
    const newEmpleado = this.empleadoRepository.create(Empleado)
    return this.empleadoRepository.save(newEmpleado), new HttpException('El Empleado se guardo con exito', HttpStatus.ACCEPTED)
    
  }

  getEmpleados(){
    return this.empleadoRepository.find({
      where:{
        eliminado:false
      }
    })
  }

  async getEmpleado(empleadoId: number){
    const empleadoFound = await this.empleadoRepository.findOne({
      where:{
        empleadoId
      }
    })
    if (!empleadoFound){
      return new HttpException('Empleado no encontrado', HttpStatus.NOT_FOUND)
    }
    return empleadoFound
  }

  async deleteEmpleado(empleadoId:number){
    const empleadoFound = await this.empleadoRepository.findOne({
      where:{
        empleadoId
      }
    })
    if (!empleadoFound){
      return new HttpException('Empleado no encontrado', HttpStatus.NOT_FOUND)
    }
    empleadoFound.eliminado = true;
    await this.empleadoRepository.save(empleadoFound);
    throw new HttpException('Empleado eliminado.', HttpStatus.ACCEPTED);

  }

  async updateEmpleado(empleadoId:number, empleado: UpdateEmpleadoDto){
    
    const empleadoFound = await this.empleadoRepository.findOne({
      where:{
        empleadoId
      }
    });
    if(!empleadoFound){
      return new HttpException('Empleado no encontrado', HttpStatus.NOT_FOUND)
    }
    const updateEmpleado = Object.assign(empleadoFound, empleado);
    return this.empleadoRepository.save(updateEmpleado);
  }


}
