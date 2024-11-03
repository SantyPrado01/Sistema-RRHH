import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriaServicioDto } from './dto/create-categoria-servicio.dto';
import { UpdateCategoriaServicioDto } from './dto/update-categoria-servicio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaServicio } from './entities/categoria-servicio.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaServicioService {

  constructor(@InjectRepository(CategoriaServicio) private categoriaServicioRepository: Repository<CategoriaServicio>){}

  async create(categoriaServicio: CreateCategoriaServicioDto){
    const categoriaServicioFound = await this.categoriaServicioRepository.findOne({
      where:{
        nombre: categoriaServicio.nombre
      }
    });
    if(categoriaServicioFound){
      return new HttpException('La Categoria ya existe. Prueba nuevamanete.', HttpStatus.CONFLICT)
    }

    const newCategoriaServicio = this.categoriaServicioRepository.create({nombre: categoriaServicio.nombre})
    await this.categoriaServicioRepository.save(newCategoriaServicio);
    return{
      message: 'Categoria creada exitosamente',
      categoriaServicio: newCategoriaServicio,
    };
  }

  get(){
    return this.categoriaServicioRepository.find({
      where:{eliminado:false}
    })
  }


  async getNombre (nombreCategoriaServico: string) {
    const categoriaServicioFound = await this.categoriaServicioRepository.findOne({
      where:{
        nombre: nombreCategoriaServico
      }
    })
    if (!nombreCategoriaServico){
      return null;
    }
    return categoriaServicioFound;
  }

  async getId(categoriaServicioId:number){
    const categoriaServicioFound = await this.categoriaServicioRepository.findOne({
      where:{
        id: categoriaServicioId
      }
    })
    if(!categoriaServicioFound){
      return new HttpException('Categoria no encontrada.', HttpStatus.NOT_FOUND)
    }
    return categoriaServicioFound;
  }

  async delete(categoriaServicioId:number){
    const categoriaServicioFound = await this.categoriaServicioRepository.findOne({
      where:{
        id: categoriaServicioId
      }
    })
    if (!categoriaServicioFound){
      return new HttpException('Categoria no encontrada.', HttpStatus.NOT_FOUND)
    }
    categoriaServicioFound.eliminado = true;
    await this.categoriaServicioRepository.save(categoriaServicioFound);
    throw new HttpException('Categoria eliminada.', HttpStatus.ACCEPTED);
  }

  async update(categoriaServicioId:number, categoriaServicio: UpdateCategoriaServicioDto){
    const categoriaServicioFound = await this.categoriaServicioRepository.findOne({
      where:{
        id: categoriaServicioId
      }
    });
    if(!categoriaServicioFound){
      return new HttpException('Categoria no encontrada', HttpStatus.NOT_FOUND)
    }
    const updateCategoriaServicio = Object.assign(categoriaServicioFound, categoriaServicio);
    return this.categoriaServicioRepository.save(updateCategoriaServicio);
  }

}
