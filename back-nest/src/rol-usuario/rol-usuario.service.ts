import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRolUsuarioDto } from './dto/create-rol-usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RolUsuario } from './entities/rol-usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolUsuarioService {

  constructor(@InjectRepository(RolUsuario) private  rolUsuarioRepository: Repository<RolUsuario>){}

  async createRolUsuario(rolUsuario: CreateRolUsuarioDto){
    const rolUsuarioFound = await this.rolUsuarioRepository.findOne({
      where:{
        nombreRolUsuario: rolUsuario.nombre
      }
    });
    if(rolUsuarioFound){
      return new HttpException('El rol de ususario  ya existe. Prueba nuevamente.', HttpStatus.CONFLICT)
    }
    const newRolUsuario = this.rolUsuarioRepository.create({nombreRolUsuario: rolUsuario.nombre})
    await this.rolUsuarioRepository.save(newRolUsuario);
    return{
      message: 'Rol creado con exito.',
      rolUsuario: newRolUsuario,
    };
  }

  getRolUsuarios(){
    return this.rolUsuarioRepository.find({
      where:{eliminado:false}
    })
  }

  async getRolUsuario(nombreRolUsuario: string){
    const rolUsuarioFound = await this.rolUsuarioRepository.findOne({
      where:{
        nombreRolUsuario
      }
    });
    if(!nombreRolUsuario){
      return null
    }
    return rolUsuarioFound
  }

  async getRolUsuarioId(id: number){
    const rolUsuarioFound = await this.rolUsuarioRepository.findOne({
      where:{
        id
      }
    });
    if(!rolUsuarioFound){
      return new HttpException('Rol no encontrado.', HttpStatus.NOT_FOUND)
    }

    return rolUsuarioFound
  }

  async deleteRolUsuario(id: number){
    const rolUsuarioFound = await this.rolUsuarioRepository.findOne({
      where:{
        id
      }
    })
    if(!id){
      return new HttpException('Rol no encontrado.', HttpStatus.NOT_FOUND)
    }
    rolUsuarioFound.eliminado = true;
    await this.rolUsuarioRepository.save(rolUsuarioFound);
    throw new HttpException('Rol Eliminado.', HttpStatus.ACCEPTED)
  }

  async updateRolUsuario(id:number, rolUsuario: UpdateRolUsuarioDto){
    const rolUsuarioFound = await this.rolUsuarioRepository.findOne({
      where:{
        id
      }
    });
    if(!rolUsuarioFound){
      return new HttpException('Rol no encontrado.', HttpStatus.NOT_FOUND)
    }
    const updateRolUsuario = Object.assign(rolUsuarioFound);
    return this.rolUsuarioRepository.save(updateRolUsuario);
  }
}
