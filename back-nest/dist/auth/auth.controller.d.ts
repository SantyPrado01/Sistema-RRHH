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
        user: import("../users/user.entity").User;
    }>;
    loging(loginDto: loginDto): Promise<{
        message: string;
        primerIngreso: boolean;
        token?: undefined;
        username?: undefined;
        role?: undefined;
    } | {
        token: string;
        username: string;
        role: import("../categoria-usuario/entities/categoria-usuario.entity").CategoriaUsuario[];
        primerIngreso: boolean;
        message?: undefined;
    }>;
    profile(req: any): any;
    updateUsuario(id: number, updateUserDto: UpdateUserDto): Promise<{
        message: string;
        user: import("../users/user.entity").User;
    }>;
}
