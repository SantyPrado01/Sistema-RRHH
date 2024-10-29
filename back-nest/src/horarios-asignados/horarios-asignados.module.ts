import { Module } from '@nestjs/common';
import { HorariosAsignadosService } from './horarios-asignados.service';
import { HorariosAsignadosController } from './horarios-asignados.controller';
import { HorarioAsignado } from './entities/horarios-asignado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioAsignado])],
  controllers: [HorariosAsignadosController],
  providers: [HorariosAsignadosService],
})
export class HorariosAsignadosModule {}
