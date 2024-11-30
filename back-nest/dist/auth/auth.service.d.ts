import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { CategoriaUsuario } from 'src/categoria-usuario/entities/categoria-usuario.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private categoriaRepository;
    constructor(userRepository: Repository<User>, jwtService: JwtService, categoriaRepository: Repository<CategoriaUsuario>);
    register({ username, categoriaId }: RegisterDto): Promise<{
        message: string;
        temporaryPassword: string;
        user: {
            username: string;
            password: string;
            categoria: CategoriaUsuario;
            eliminado: boolean;
            primerIngreso: boolean;
        } & User;
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
        role: CategoriaUsuario;
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
