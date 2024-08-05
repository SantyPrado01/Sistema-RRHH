import { Module } from '@nestjs/common';
import { NecesidadHorariaService } from './necesidad-horaria.service';
import { NecesidadHorariaController } from './necesidad-horaria.controller';

@Module({
  controllers: [NecesidadHorariaController],
  providers: [NecesidadHorariaService],
})
export class NecesidadHorariaModule {}
