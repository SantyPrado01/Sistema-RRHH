import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

@Controller('empleados')
export class EmpleadosController {
  constructor(private readonly empleadosService: EmpleadosService) {}

  @Post()
  createEmpleado(@Body() createEmpleadoDto: CreateEmpleadoDto) {
    return this.empleadosService.createEmpleado(createEmpleadoDto);
  }

  @Get()
  getEmpleados() {
    return this.empleadosService.getEmpleados();
  }

  @Get(':id')
  getEmpleado(@Param('id', ParseIntPipe) id: string) {
    return this.empleadosService.getEmpleado(+id);
  }

  @Patch(':id')
  updateEmpleado(@Param('id') id: string, @Body() updateEmpleadoDto: UpdateEmpleadoDto) {
    return this.empleadosService.updateEmpleado(+id, updateEmpleadoDto);
  }

  @Delete(':id')
  deleteEmpleado(@Param('id') id: string) {
    return this.empleadosService.deleteEmpleado(+id);
  }
}
