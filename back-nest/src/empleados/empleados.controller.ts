import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';
import { CreateDisponibilidadHorariaDto } from 'src/disponibilidad-horaria/dto/create-disponibilidad-horaria.dto';

@Controller('empleados')
export class EmpleadosController {
  constructor(
    private readonly empleadosService: EmpleadosService,
  ) {}

  @Post()
  async create(@Body() createEmpleadoDto: CreateEmpleadoDto): Promise<any> {
    // Crear el empleado
    const empleado = await this.empleadosService.createEmpleado(createEmpleadoDto);
    if (!empleado) throw new HttpException('No se pudo crear el empleado', HttpStatus.BAD_REQUEST);

    // Crear las disponibilidades horarias asociadas al empleado
    const disponibilidadesHorarias = await this.empleadosService.createDisponibilidad(
      empleado.Id,
      createEmpleadoDto.disponibilidades,  // Se espera que el DTO del empleado tenga las disponibilidades
    );

    return {
      message: 'Empleado y disponibilidades creados con éxito',
      empleado,
      disponibilidadesHorarias,
    };
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
