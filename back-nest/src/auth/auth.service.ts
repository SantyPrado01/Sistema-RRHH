import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CategoriaUsuario } from 'src/categoria-usuario/entities/categoria-usuario.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {

    constructor(
      @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ){}

    async register({ userName, categoriaId, eliminado }: RegisterDto) {
        const user = await this.userRepository.findOne({where:{username: userName}});
        if (user) {
          throw new HttpException('El usuario ya existe', HttpStatus.NOT_ACCEPTABLE);
        }
        const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
      
        const createUserDto: CreateUserDto = {
          userName,
          password: hashedPassword,
          categoriaId,
          eliminado: false, 
          primerIngreso: true, 
        };
      
        const newUser = await this.userRepository.create(createUserDto);
      
        return { 
          message: 'Usuario registrado con éxito',
          temporaryPassword: randomPassword,
          user: newUser
        };
      }
      

      async login({ userName, password }: loginDto) {
        const user = await this.userRepository.findOne({where:{username: userName}});
      
        if (!user) {throw new HttpException('Usuario no existente', HttpStatus.NOT_FOUND);}
        const isPasswordValid = await bcrypt.compare(password, user.password);      
        if (!isPasswordValid) {throw new HttpException('Contraseña incorrecta', HttpStatus.NOT_ACCEPTABLE);}

        if (user.primerIngreso) {
          return {
            message: 'Debe cambiar su contraseña',
            primerIngreso: true,
          };
        }
      
        const payload = { username: user.username, role: user.categoria };
        const token = await this.jwtService.signAsync(payload);
      
        return {
          token,
          username: user.username,
          role: user.categoria,
          primerIngreso: false,
        };
      }

      async updateUsuario(userId: number, updateUserDto: UpdateUserDto) {
        
        const user = await this.userRepository.findOne({where:{id: userId}});
        if (!user) {
          throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }

        if (updateUserDto.password) {
          const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
          user.password = hashedPassword;
        }

        if (updateUserDto.eliminado !== undefined) {
          user.eliminado = updateUserDto.eliminado;
        }

        await this.userRepository.save(user);
        return { message: 'Usuario actualizado con éxito', user };
      }
      
}
