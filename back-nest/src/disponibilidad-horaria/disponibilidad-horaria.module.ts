import { Module } from '@nestjs/common';
import { DisponibilidadHorariaService } from './disponibilidad-horaria.service';
import { DisponibilidadHorariaController } from './disponibilidad-horaria.controller';
import { DisponibilidadHoraria } from './entities/disponibilidad-horaria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DisponibilidadHoraria])],
  controllers: [DisponibilidadHorariaController],
  providers: [DisponibilidadHorariaService],
})
export class DisponibilidadHorariaModule {}
