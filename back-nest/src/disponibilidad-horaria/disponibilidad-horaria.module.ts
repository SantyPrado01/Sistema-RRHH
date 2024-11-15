import { Module } from '@nestjs/common';
import { DisponibilidadHorariaService } from './disponibilidad-horaria.service';
import { DisponibilidadHorariaController } from './disponibilidad-horaria.controller';
import { DisponibilidadHoraria } from './entities/disponibilidad-horaria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadosModule } from 'src/empleados/empleados.module';
import { Empleado } from 'src/empleados/entities/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado,DisponibilidadHoraria])],
  controllers: [DisponibilidadHorariaController],
  providers: [DisponibilidadHorariaService],
  exports: [DisponibilidadHorariaModule],
})
export class DisponibilidadHorariaModule {}
