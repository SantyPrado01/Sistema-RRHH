import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("@nestjs/common").HttpException | import("../users/user.entity").User>;
    loging(loginDto: loginDto): Promise<import("@nestjs/common").HttpException | {
        token: string;
        username: string;
    }>;
    profile(req: any): any;
}
