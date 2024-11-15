import { Module } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { HttpModule } from '@nestjs/axios';
import { DisponibilidadHorariaModule } from 'src/disponibilidad-horaria/disponibilidad-horaria.module';
import { DisponibilidadHoraria } from 'src/disponibilidad-horaria/entities/disponibilidad-horaria.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado, DisponibilidadHoraria]), HttpModule ],
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
  exports:[EmpleadosService]
})
export class EmpleadosModule {}
