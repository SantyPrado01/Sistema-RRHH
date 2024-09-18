import { HttpException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly userService;
    private readonly jwtService;
    constructor(userService: UsersService, jwtService: JwtService);
    register({ username, password, rol, eliminado }: RegisterDto): Promise<import("../users/user.entity").User | HttpException>;
    login({ username, password }: loginDto): Promise<HttpException | {
        token: string;
        username: string;
    }>;
}
