import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CategoriaUsuario } from 'src/categoria-usuario/entities/categoria-usuario.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register({ userName, categoriaId, eliminado }: RegisterDto): Promise<{
        message: string;
        temporaryPassword: string;
        user: User;
    }>;
    login({ userName, password }: loginDto): Promise<{
        message: string;
        primerIngreso: boolean;
        token?: undefined;
        username?: undefined;
        role?: undefined;
    } | {
        token: string;
        username: string;
        role: CategoriaUsuario[];
        primerIngreso: boolean;
        message?: undefined;
    }>;
    updateUsuario(userId: number, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        user: User;
    }>;
}
