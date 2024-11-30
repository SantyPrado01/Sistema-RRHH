import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        temporaryPassword: string;
        user: {
            username: string;
            password: string;
            categoria: import("../categoria-usuario/entities/categoria-usuario.entity").CategoriaUsuario;
            eliminado: boolean;
            primerIngreso: boolean;
        } & import("../users/user.entity").User;
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
    loging(loginDto: loginDto): Promise<{
        id: number;
        username: string;
        message: string;
        primerIngreso: boolean;
        token?: undefined;
        role?: undefined;
    } | {
        token: string;
        username: string;
        role: import("../categoria-usuario/entities/categoria-usuario.entity").CategoriaUsuario;
        primerIngreso: boolean;
        id?: undefined;
        message?: undefined;
    }>;
    profile(req: any): any;
    updateUsuario(id: number, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        user: import("../users/user.entity").User;
    }>;
}
