import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { ILike } from 'typeorm';

@Injectable()
export class ServiciosService {

  constructor(@InjectRepository(Servicio) private servicioRepository: Repository<Servicio>){}

  async createServicio(servicio: CreateServicioDto){
    const servicioFound = await this.servicioRepository.findOne({
      where:{
        nombre: servicio.nombre
      }
    });
    if(servicioFound){
      throw new HttpException('El servicio ya existe. Prueba nuevamente.', HttpStatus.CONFLICT)
    }
    const newServicio = this.servicioRepository.create(servicio)
    return this.servicioRepository.save(newServicio)
  }

  getServicios(){
    return this.servicioRepository.find({relations:['categoria']})
  }

  getServiciosEliminado(){
    return this.servicioRepository.find({where:{eliminado: false}})
  }

  async getServicioId(id: number): Promise<Servicio> {
    const servicio = await this.servicioRepository.findOne({
      where:{servicioId: id},
      relations:['categoria']
    });
    if (!servicio) {
      throw new HttpException('Servicio no encontrado.', HttpStatus.NOT_FOUND);
    }
    return servicio;
  }

  async deleteServicio(servicioId: number){
    const servicioFound = await this.servicioRepository.findOne({
      where:{
        servicioId
      }
    });
    if(!servicioFound){
      throw new HttpException('Servicio no encontrado.', HttpStatus.NOT_FOUND)
    }

    servicioFound.eliminado = true;
    await this.servicioRepository.save(servicioFound);
    throw new HttpException('Servicio Eliminado', HttpStatus.ACCEPTED)
  }
  
  async updateServicio(servicioId: number, servicio: UpdateServicioDto) {
    const servicioFound = await this.servicioRepository.findOne({
        where: {
            servicioId,
        },
    });

    if (!servicioFound) {
        throw new HttpException('Servicio no encontrado.', HttpStatus.NOT_FOUND);
    }
    console.log('DTO recibido:', servicio);
    const updateServicio = Object.assign(servicioFound, servicio);
    return this.servicioRepository.save(updateServicio);
}

async buscarPorNombre(termino: string): Promise<Servicio[]> {
    return this.servicioRepository.find({
      where: {
        nombre: ILike(`%${termino}%`), // <-- busca parcialmente sin importar mayúsculas/minúsculas
        eliminado: false,              // <-- si estás manejando soft-delete
      },
      take: 6, // <-- opcional: limita la cantidad de resultados
    });
  }
}
