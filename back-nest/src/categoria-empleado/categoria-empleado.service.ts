import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriaEmpleadoDto } from './dto/create-categoria-empleado.dto';
import { UpdateCategoriaEmpleadoDto } from './dto/update-categoria-empleado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaEmpleado } from './entities/categoria-empleado.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaEmpleadoService {

  constructor(@InjectRepository(CategoriaEmpleado) private categoriaEmpleadoRepository: Repository<CategoriaEmpleado>){}

  async createCategoriaEmpleado(categoriaEmpleado: CreateCategoriaEmpleadoDto){
    const categoriaEmpleadoFound = await this.categoriaEmpleadoRepository.findOne({
      where:{
        categoriaEmpleadoNombre: categoriaEmpleado.nombre
      }
    });
    if(categoriaEmpleadoFound){
      return new HttpException('La Categoria ya existe. Prueba nuevamente.', HttpStatus.CONFLICT)
    }
    const newCategoriaEmpleado = this.categoriaEmpleadoRepository.create({categoriaEmpleadoNombre: categoriaEmpleado.nombre})
    await this.categoriaEmpleadoRepository.save(newCategoriaEmpleado);
    return{
      message: 'Categoria creada exitosamente.',
      categoriaEmpleado: newCategoriaEmpleado,
    };
  }

  getCategoriasEmpleados(){
    return this.categoriaEmpleadoRepository.find({
      where:{eliminado:false}
    })
  }

  async getCategoriaEmpleado(categoriaEmpleadoNombre:string){
    const categoriaEmpleadoFound = await this.categoriaEmpleadoRepository.findOne({
      where:{
        categoriaEmpleadoNombre
      }
    })
    if(!categoriaEmpleadoNombre){
      return null;
    }
    return categoriaEmpleadoFound;
  }

  async getCategoriaEmpleadoId(categoriaEmpleadoId:number){
    const categoriaEmpleadoFound = await this.categoriaEmpleadoRepository.findOne({
      where:{
        categoriaEmpleadoId
      }
    })
    if (!categoriaEmpleadoFound){
      return new HttpException('Categoria no encontrada.', HttpStatus.NOT_FOUND)
    }
    return categoriaEmpleadoFound;
  }

  async deleteCategoriaServicio(categoriaEmpleadoId:number){
    const categoriaEmpleadoFound = await this.categoriaEmpleadoRepository.findOne({
      where:{
        categoriaEmpleadoId
      }
    })
    if(!categoriaEmpleadoFound){
      return new HttpException('Categoria no encontrada', HttpStatus.NOT_FOUND)
    }
    categoriaEmpleadoFound.eliminado = true;
    await this.categoriaEmpleadoRepository.save(categoriaEmpleadoFound)
    throw new HttpException('Categoria Eliminada.', HttpStatus.ACCEPTED)
    
  }

  async updateCategoriaEmpleado(categoriaEmpleadoId:number, categoriaEmpleado: UpdateCategoriaEmpleadoDto){
    const categoriaEmpleadoFound = await this.categoriaEmpleadoRepository.findOne({
      where:{
        categoriaEmpleadoId
      }
    });
    if(!categoriaEmpleadoFound){
      return new HttpException('Categoria no encontrada.', HttpStatus.NOT_FOUND)
    }
    const updateCategoriaEmpleado = Object.assign(categoriaEmpleadoFound, categoriaEmpleado);
    return this.categoriaEmpleadoRepository.save(updateCategoriaEmpleado);
  }

}
