//Biblioteca que se comunica con la base de datos

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity'
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpException, HttpStatus } from '@nestjs/common'; 


@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepository:Repository<User>){}

    async createUser(user: CreateUserDto){

       const userFound = await this.userRepository.findOne({
            where:{
                username: user.username
            }
        })
        if (userFound){
            return new HttpException('El usuario ya existe. Prueba nuevamente.', HttpStatus.CONFLICT)
        }


        const newUser = this.userRepository.create(user)
        return this.userRepository.save(newUser)
    }

    getUsers(){
        return this.userRepository.find()
    }

    async getUsername(username:string){

        const userFound =await this.userRepository.findOne({
            where:{
                username
            }
        })

        if (!userFound){
            return null;
        }
        return userFound
    }


    async getUserId(id: number) {
        const userFound = await this.userRepository.findOne({
            where:{
                id
            }
        })

        if (!userFound){
            return new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND)
        }
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
            where:{
                id
            } 
        })
        console.log("Se Actualizo");
        ;
        if (!userFound){
            return new HttpException('Usuario no encontrado.', HttpStatus.NOT_FOUND)
        }

        const updateUser = Object.assign(userFound, user);
        return this.userRepository.save(updateUser);

    }

}
