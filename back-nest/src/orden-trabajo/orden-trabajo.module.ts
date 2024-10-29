import { Module } from '@nestjs/common';
import { OrdenTrabajoService } from './orden-trabajo.service';
import { OrdenTrabajoController } from './orden-trabajo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrdenTrabajo])],
  controllers: [OrdenTrabajoController],
  providers: [OrdenTrabajoService],
})
export class OrdenTrabajoModule {}
