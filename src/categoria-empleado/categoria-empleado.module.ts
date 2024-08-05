import { Module } from '@nestjs/common';
import { CategoriaEmpleadoService } from './categoria-empleado.service';
import { CategoriaEmpleadoController } from './categoria-empleado.controller';

@Module({
  controllers: [CategoriaEmpleadoController],
  providers: [CategoriaEmpleadoService],
})
export class CategoriaEmpleadoModule {}
