import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ){}

    async register({username, password}: RegisterDto){

        const user = await this.userService.getUsername(username)

        if (user){
            return new HttpException('El usuario ya existe', HttpStatus.NOT_ACCEPTABLE)
        };

        return await this.userService.createUser({
            username, 
            password: await bcrypt.hash(password,10)
        });
    };

    async login({username, password}: loginDto){
        const user = await this.userService.getUsername(username);

        if (!user){
            return new HttpException('Usuario no Existente', HttpStatus.NOT_FOUND)
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return new HttpException('Contraseña Incorrecta', HttpStatus.NOT_ACCEPTABLE)
        }

        const payload = {username: user.username};

        const token = await this.jwtService.signAsync(payload)

        return {
            token, username
        };
    }
}
