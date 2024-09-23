import { Module } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { EmpleadosController } from './empleados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from './entities/empleado.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado]), HttpModule],
  controllers: [EmpleadosController],
  providers: [EmpleadosService],
  exports:[EmpleadosService]
})
export class EmpleadosModule {}
