import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Controller('empleados')
export class EmpleadosController {
  constructor(
    private readonly empleadosService: EmpleadosService,
  ) {}

  @Post()
  createEmpleado(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return this.empleadosService.create(createEmpleadoDto);
  }

  @Get()
  getEmpleados() {
    return this.empleadosService.get();
  }

  @Get(':id')
  getEmpleado(@Param('id', ParseIntPipe) id: string) {
    return this.empleadosService.getId(+id);
  }

  @Patch(':id')
  updateEmpleado(@Param('id') id: string, @Body() updateEmpleadoDto: UpdateEmpleadoDto) {
    return this.empleadosService.update(+id, updateEmpleadoDto);
  }

  @Delete(':id')
  deleteEmpleado(@Param('id') id: string) {
    return this.empleadosService.delete(+id);
  }
}
