import { Module } from '@nestjs/common';
import { OrdenTrabajoService } from './ordenTrabajo.service';
import { OrdenTrabajoController } from './ordenTrabajo.controller'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenTrabajo } from './entities/ordenTrabajo.entity'; 
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { HorarioAsignado } from 'src/horariosAsignados/entities/horariosAsignados.entity'; 
import { NecesidadHoraria } from 'src/necesidadHoraria/entities/necesidadHoraria.entity'; 

@Module({
  imports: [TypeOrmModule.forFeature([OrdenTrabajo, Empleado, Servicio, HorarioAsignado, NecesidadHoraria])],
  controllers: [OrdenTrabajoController],
  providers: [OrdenTrabajoService],
  exports:[OrdenTrabajoService]
})
export class OrdenTrabajoModule {}