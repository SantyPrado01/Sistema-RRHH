import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
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

    async register({ username, categoriaId }: RegisterDto) {
        const user = await this.userRepository.findOne({where:{username: username}});
        if (user) {
          throw new HttpException('El usuario ya existe', HttpStatus.NOT_ACCEPTABLE);
        }
        const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);
        console.log('registerDto', username, categoriaId)
        const createUserDto: CreateUserDto = {
          username,
          password: hashedPassword,
          categoriaId,
          eliminado: false, 
          primerIngreso: true, 
        };
        console.log('createUserDto', createUserDto);
        const newUser = await this.userRepository.save(createUserDto);
      
        return { 
          message: 'Usuario registrado con éxito',
          temporaryPassword: randomPassword,
          user: newUser
        };
      }
      

      async login({ username, password }: loginDto) {
        const user = await this.userRepository.findOne({where:{username: username}});
      
        if (!user) {throw new HttpException('Usuario no existente', HttpStatus.NOT_FOUND);}
        const isPasswordValid = await bcrypt.compare(password, user.password);      
        if (!isPasswordValid) {throw new HttpException('Contraseña incorrecta', HttpStatus.NOT_ACCEPTABLE);}

        if (user.primerIngreso) {
          return {
            id: user.id,
            username: user.username,
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

      async changePassword(userId: number, newPassword: string) {
        console.log(newPassword)
        const user = await this.userRepository.findOne({where:{id: userId}});
      
        if (!user) {
          throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
      
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.primerIngreso = false;
      
        await this.userRepository.save(user);
      
        return { message: 'Contraseña actualizada con éxito' };
      }

      async recoverPassword(userId: number) {
        const user = await this.userRepository.findOne({ where: { id:userId} });
        
        if (!user) {
            throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }
        const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        user.password = hashedPassword;
        user.primerIngreso = true;
        
        await this.userRepository.save(user);
        
        return { 
            message: 'Contraseña recuperada con éxito',
            temporaryPassword: randomPassword, 
            user: {
                id: user.id,
                username: user.username,
                primerIngreso: user.primerIngreso
            }
        };
    }

      async updateUsuario(userId: number, updateUserDto: UpdateUserDto) {
        
        const user = await this.userRepository.findOne({where:{id: userId}});
        if (!user) {
          throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
        }

        if (updateUserDto.password) {
          const randomPassword = Math.floor(1000 + Math.random() * 9000).toString();
          const hashedPassword = await bcrypt.hash(randomPassword, 10);
          user.password = hashedPassword;
          user.primerIngreso = true
        }

        if (updateUserDto.eliminado !== undefined) {
          user.eliminado = updateUserDto.eliminado;
        }

        await this.userRepository.save(user);
        return { message: 'Usuario actualizado con éxito', user };
      }
      
}
