import { Module } from '@nestjs/common';
import { DisponibilidadHorariaService } from './disponibilidad-horaria.service';
import { DisponibilidadHorariaController } from './disponibilidad-horaria.controller';
import { DisponibilidadHoraria } from './entities/disponibilidad-horaria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadosModule } from 'src/empleados/empleados.module';

@Module({
  imports: [TypeOrmModule.forFeature([DisponibilidadHoraria]), EmpleadosModule],
  controllers: [DisponibilidadHorariaController],
  providers: [DisponibilidadHorariaService],
})
export class DisponibilidadHorariaModule {}
