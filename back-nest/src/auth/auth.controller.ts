import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('register')
    register(
        @Body()registerDto: RegisterDto,
    ){
        return this.authService.register(registerDto)
    };

    @Post('login')
    loging(@Body() loginDto: loginDto){
        return this.authService.login(loginDto);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    profile(
        @Request()
        req,
    ){
        return req.user;
    }

}
