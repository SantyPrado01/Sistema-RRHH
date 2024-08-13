import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ciudad } from './entities/ciudad.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CiudadService {

  constructor(@InjectRepository(Ciudad) private ciudadRepository:Repository<Ciudad>){}

  async createCiudad(ciudad: CreateCiudadDto){
    const ciudadFound = await this.ciudadRepository.findOne({
      where:{
        nombreCiudad: ciudad.nombre
      }
    });
    if(ciudadFound){
      return new HttpException('La Ciudad ya existe. Prueba nuevamente.', HttpStatus.CONFLICT);
    }
    const newCiudad = this.ciudadRepository.create({nombreCiudad: ciudad.nombre});
    await this.ciudadRepository.save(newCiudad);
    return {
      message: 'Ciudad creada exitosamente',
      ciudad: newCiudad,
    };

  }

  getCiudades(){
    return this.ciudadRepository.find()
  }

  async getCiudad(nombreCiudad:string){
    const ciudadFound = await this.ciudadRepository.findOne({
      where:{
        nombreCiudad
      }
    })
    if (!ciudadFound){
      return null;
    }
    return ciudadFound
  }

  async getCiudadId(idCiudad: number){
    const ciudadFound = await this.ciudadRepository.findOne({
      where:{
        idCiudad
      }
    })
    if (!ciudadFound){
      return new HttpException("Ciudad no encontrada.", HttpStatus.NOT_FOUND)
    }
    return ciudadFound
  }

  async deleteCiudad(idCiudad: number){
    const ciudadFound = await this.ciudadRepository.findOne({
      where:{idCiudad}
    });

    if (!ciudadFound){
      return new HttpException("Ciudad no encontrada.", HttpStatus.NOT_FOUND)
    }
    ciudadFound.eliminado = true;
    await this.ciudadRepository.save(ciudadFound);
    throw new HttpException('Ciudad eliminada.', HttpStatus.ACCEPTED);


  }

  async updateCiudad(idCiudad:number, ciudad: UpdateCiudadDto){

    const ciudadFound = await this.ciudadRepository.findOne({
      where:{
        idCiudad
      }
    });
    if (!ciudadFound){
      return new HttpException("Ciudad no encontrada.", HttpStatus.NOT_FOUND)
    }

    const updateCiudad = Object.assign(ciudadFound, ciudad);
    return this.ciudadRepository.save(updateCiudad);

  }
}
