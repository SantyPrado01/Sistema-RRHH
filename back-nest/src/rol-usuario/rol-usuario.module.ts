import { Module } from '@nestjs/common';
import { RolUsuarioService } from './rol-usuario.service';
import { RolUsuarioController } from './rol-usuario.controller';
import { RolUsuario } from './entities/rol-usuario.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RolUsuario])],
  controllers: [RolUsuarioController],
  providers: [RolUsuarioService],
})
export class RolUsuarioModule {}
