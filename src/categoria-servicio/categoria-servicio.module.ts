import { Module } from '@nestjs/common';
import { CategoriaServicioService } from './categoria-servicio.service';
import { CategoriaServicioController } from './categoria-servicio.controller';

@Module({
  controllers: [CategoriaServicioController],
  providers: [CategoriaServicioService],
})
export class CategoriaServicioModule {}
