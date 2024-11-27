import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register({ username, categoriaId }: RegisterDto): Promise<{
        message: string;
        temporaryPassword: string;
        user: CreateUserDto & User;
    }>;
    login({ username, password }: loginDto): Promise<{
        id: number;
        username: string;
        message: string;
        primerIngreso: boolean;
        token?: undefined;
        role?: undefined;
    } | {
        token: string;
        username: string;
        role: import("../categoria-usuario/entities/categoria-usuario.entity").CategoriaUsuario[];
        primerIngreso: boolean;
        id?: undefined;
        message?: undefined;
    }>;
    changePassword(userId: number, newPassword: string): Promise<{
        message: string;
    }>;
    recoverPassword(userId: number): Promise<{
        message: string;
        temporaryPassword: string;
        user: {
            id: number;
            username: string;
            primerIngreso: boolean;
        };
    }>;
    updateUsuario(userId: number, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        user: User;
    }>;
}
