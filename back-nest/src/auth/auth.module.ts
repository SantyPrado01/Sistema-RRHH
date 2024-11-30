//Permite la entrada y salida de servicios, proveedores, controladores...

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtCosntants } from './constants/jwt.constant';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { CategoriaUsuario } from 'src/categoria-usuario/entities/categoria-usuario.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([User, CategoriaUsuario]),UsersModule,
    JwtModule.register({
      global:true,
      secret: jwtCosntants.secret,
      signOptions: {expiresIn: '1d'},
    })
  ]
})
export class AuthModule {}
