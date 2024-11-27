import { Body, Controller, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { loginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('register')
    register(@Body()registerDto: RegisterDto,){
        return this.authService.register(registerDto)
    };

    @Patch(':userId/change-password') 
    async changePassword(
    @Param('userId') userId: number, 
    @Body('newPassword') newPassword: string, 
    ) {
        console.log('Contraseña recibida:', newPassword);
    return this.authService.changePassword(userId, newPassword); 
    }

    @Patch('recover-password/:userId')
    async recoverPassword(@Param('userId') userId: number) {
        const result = await this.authService.recoverPassword(userId);
        return {
          message: result.message,
          temporaryPassword: result.temporaryPassword,
          user: result.user
        };
      }

    @Post('login')
    loging(@Body() loginDto: loginDto){
        return this.authService.login(loginDto);
    }

    @Get('profile')
    @UseGuards(AuthGuard)
    profile(@Request()req,
    ){
        return req.user;
    }

    @Patch(':id')
    async updateUsuario(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    ) {
    return this.authService.updateUsuario(id, updateUserDto);
    }

}
