import { Module } from '@nestjs/common';
import { NecesidadHorariaService } from './necesidad-horaria.service';
import { NecesidadHorariaController } from './necesidad-horaria.controller';
import { NecesidadHoraria } from './entities/necesidad-horaria.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenTrabajo } from 'src/orden-trabajo/entities/orden-trabajo.entity';
import { OrdenTrabajoModule } from 'src/orden-trabajo/orden-trabajo.module';

@Module({
  imports: [TypeOrmModule.forFeature([NecesidadHoraria, OrdenTrabajo]), OrdenTrabajoModule],  
  controllers: [NecesidadHorariaController],
  providers: [NecesidadHorariaService],
})
export class NecesidadHorariaModule {}
