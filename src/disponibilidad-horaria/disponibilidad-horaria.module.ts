import { Module } from '@nestjs/common';
import { DisponibilidadHorariaService } from './disponibilidad-horaria.service';
import { DisponibilidadHorariaController } from './disponibilidad-horaria.controller';

@Module({
  controllers: [DisponibilidadHorariaController],
  providers: [DisponibilidadHorariaService],
})
export class DisponibilidadHorariaModule {}
