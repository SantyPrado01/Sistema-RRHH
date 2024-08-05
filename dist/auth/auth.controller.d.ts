import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("../users/user.entity").User | import("@nestjs/common").HttpException>;
    loging(loginDto: loginDto): Promise<import("@nestjs/common").HttpException | {
        token: string;
        username: string;
    }>;
    profile(req: any): any;
}
