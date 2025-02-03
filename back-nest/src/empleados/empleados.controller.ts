import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { EmpleadosService } from './empleados.service';
import { CreateEmpleadoDto } from './dto/create-empleado.dto';
import { UpdateEmpleadoDto } from './dto/update-empleado.dto';

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

  @Get('/true')
  getEmpleadosEliminado(){
    return this.empleadosService.getEliminado();
  }

  @Get(':id')
  getEmpleado(@Param('id', ParseIntPipe) id: string) {
    return this.empleadosService.getId(+id);
  }

  @Patch(':id')
  async updateEmpleado(
  @Param('id', ParseIntPipe) id: number,
  @Body() updateEmpleadoDto: UpdateEmpleadoDto,
  ): Promise<any> {
  // Actualizar los datos del empleado
  const empleadoActualizado = await this.empleadosService.update(id, updateEmpleadoDto);

  // Si hay disponibilidades, actualizarlas
  if (updateEmpleadoDto.disponibilidades) {
    await this.empleadosService.updateDisponibilidad(
      id,
      updateEmpleadoDto.disponibilidades,
    );
  }

  return {
    message: 'Empleado y disponibilidades actualizados con éxito',
    empleado: empleadoActualizado,
  };
}



  @Delete(':id')
  deleteEmpleado(@Param('id') id: string) {
    return this.empleadosService.delete(+id);
  }
}
