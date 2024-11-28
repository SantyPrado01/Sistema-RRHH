//Biblioteca que se comunica con la base de datos

import { Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity'
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common'; 


@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepository:Repository<User>){}


    getUsers(){
        return this.userRepository.find()
    }

    async getUsername(username:string){
        const userFound =await this.userRepository.findOne({
            where:{username}
        })

        if (!userFound){
            return null;
        }
        return userFound
    }

    async getUserId(id: number) {
        const userFound = await this.userRepository.findOne({
            where:{id}
        })
        if (!userFound){return null}
        return userFound
    }

    async deleteUser(id:number){
        const userFound =  await this.userRepository.findOne({
            where:{id}
         });
         
         if (!userFound){
            return new HttpException('Usuario no encontrado.',HttpStatus.NOT_FOUND)
         }
         userFound.eliminado = true;
         await this.userRepository.save(userFound); 
         throw new HttpException('Usuario eliminado.', HttpStatus.ACCEPTED)

    }

    async updateUser(id:number, user: UpdateUserDto) {

        const userFound = await this.userRepository.findOne({
            where:{id} 
        })
        if (!userFound){
            return new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND)
        }
        console.log(user)
        const updateUser = Object.assign(userFound, user);
        console.log(updateUser)
        return this.userRepository.save(updateUser);
    }
}
