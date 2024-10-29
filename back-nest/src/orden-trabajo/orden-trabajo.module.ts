import { Module } from '@nestjs/common';
import { OrdenTrabajoService } from './orden-trabajo.service';
import { OrdenTrabajoController } from './orden-trabajo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
import { EmpleadosModule } from 'src/empleados/empleados.module';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { HorarioAsignado } from 'src/horarios-asignados/entities/horarios-asignado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenTrabajo, Empleado, Servicio, HorarioAsignado])],
  controllers: [OrdenTrabajoController],
  providers: [OrdenTrabajoService],
})
export class OrdenTrabajoModule {}
