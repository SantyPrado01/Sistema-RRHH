import { Module } from '@nestjs/common';
import { NecesidadHorariaService } from './necesidad-horaria.service';
import { NecesidadHorariaController } from './necesidad-horaria.controller';
import { NecesidadHoraria } from './entities/necesidad-horaria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([NecesidadHoraria])],
  controllers: [NecesidadHorariaController],
  providers: [NecesidadHorariaService],
})
export class NecesidadHorariaModule {}
