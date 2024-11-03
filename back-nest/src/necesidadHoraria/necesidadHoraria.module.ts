import { Module } from '@nestjs/common';
import { NecesidadHorariaService } from './necesidadHoraria.service'; 
import { NecesidadHorariaController } from './necesidadHoraria.controller'; 
import { NecesidadHoraria } from './entities/necesidadHoraria.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenTrabajo } from 'src/ordenTrabajo/entities/ordenTrabajo.entity'; 
import { OrdenTrabajoModule } from 'src/ordenTrabajo/ordenTrabajo.module'; 

@Module({
  imports: [TypeOrmModule.forFeature([NecesidadHoraria, OrdenTrabajo]), OrdenTrabajoModule],  
  controllers: [NecesidadHorariaController],
  providers: [NecesidadHorariaService],
})
export class NecesidadHorariaModule {}