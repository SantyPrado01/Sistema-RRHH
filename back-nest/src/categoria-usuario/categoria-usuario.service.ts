import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoriaUsuarioDto } from './dto/create-categoria-usuario.dto';
import { UpdateCategoriaUsuarioDto } from './dto/update-categoria-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaUsuario } from './entities/categoria-usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriaUsuarioService {

  constructor(@InjectRepository(CategoriaUsuario) private categoriaUsuarioRepository: Repository<CategoriaUsuario>){}

  async create(categoriaUsuario: CreateCategoriaUsuarioDto) {
    const categoriaUsuarioFound = await this.categoriaUsuarioRepository.findOne({
      where:{
        nombre: categoriaUsuario.nombre
      }
    });
    if(categoriaUsuarioFound){
      return new HttpException('La Categoria ya existe. Prueba nuevamente.', HttpStatus.CONFLICT)
    };
    const newCategoriaUsuario = this.categoriaUsuarioRepository.create({nombre: categoriaUsuario.nombre})
    await this.categoriaUsuarioRepository.save(newCategoriaUsuario);
    return {
      message: 'Categoria creada exitosamente',
      categoriaUsuario: newCategoriaUsuario,
    };
  }

  findAll() {
    return this.categoriaUsuarioRepository.find();
  }

  async findName(nombreCategoriaUsuario: string) {
    const categoriaUsuarioFound = await this.categoriaUsuarioRepository.findOne({
      where:{
        nombre: nombreCategoriaUsuario
      }
    })
    if (!nombreCategoriaUsuario){
      return null;
    }
    return categoriaUsuarioFound

  }

  async findOne(categoriaUsuarioId: number) {
    const categoriaUsuarioFound = await this.categoriaUsuarioRepository.findOne({
      where:{
        id: categoriaUsuarioId
      }
    });
    if(!categoriaUsuarioFound){
      return new HttpException('Categoria no encontrada.', HttpStatus.NOT_FOUND)
    }
    return categoriaUsuarioFound
  }

  async update(categoriaUsuarioId: number, categoriaUsuario: UpdateCategoriaUsuarioDto) {
    const categoriaUsuarioFound = await this.categoriaUsuarioRepository.findOne({
      where:{
        id: categoriaUsuarioId
      }
    });
    if(!categoriaUsuarioFound){
      return new HttpException('Categoria no encontradad', HttpStatus.NOT_FOUND)
    }
    const updateCategoriaUsuario = Object.assign(categoriaUsuarioFound, categoriaUsuario);
    return this.categoriaUsuarioRepository.save(updateCategoriaUsuario)
  }

  async remove(categoriaUsuarioId: number) {
    const categoriaUsuarioFound = await this.categoriaUsuarioRepository.findOne({
      where:{
        id: categoriaUsuarioId
      }
    });
    if (!categoriaUsuarioFound){
      return new HttpException('Categoria no encontrada.', HttpStatus.NOT_FOUND)
    } 
    categoriaUsuarioFound.eliminado = true;
    await this.categoriaUsuarioRepository.save(categoriaUsuarioFound);
    throw new HttpException('Categoria eliminada.', HttpStatus.ACCEPTED)
  }
}
