import { Module } from '@nestjs/common';
import { HorarioAsignadoService } from './horarios-asignados.service';
import { HorariosAsignadosController } from './horarios-asignados.controller';
import { HorarioAsignado } from './entities/horarios-asignado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenTrabajo } from 'src/orden-trabajo/entities/orden-trabajo.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HorarioAsignado, OrdenTrabajo, Empleado])],
  controllers: [HorariosAsignadosController],
  providers: [HorarioAsignadoService],
})
export class HorariosAsignadosModule {}
