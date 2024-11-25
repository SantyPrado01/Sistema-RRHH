import { Module } from '@nestjs/common';
import { CategoriaUsuarioService } from './categoria-usuario.service';
import { CategoriaUsuarioController } from './categoria-usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaUsuario } from './entities/categoria-usuario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CategoriaUsuario])],
  controllers: [CategoriaUsuarioController],
  providers: [CategoriaUsuarioService],
})
export class CategoriaUsuarioModule {}
