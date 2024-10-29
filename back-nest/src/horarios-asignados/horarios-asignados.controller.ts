import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HorariosAsignadosService } from './horarios-asignados.service';
import { CreateHorariosAsignadoDto } from './dto/create-horarios-asignado.dto';
import { UpdateHorariosAsignadoDto } from './dto/update-horarios-asignado.dto';

@Controller('horarios-asignados')
export class HorariosAsignadosController {
  constructor(private readonly horariosAsignadosService: HorariosAsignadosService) {}

  @Post()
  create(@Body() createHorariosAsignadoDto: CreateHorariosAsignadoDto) {
    return this.horariosAsignadosService.create(createHorariosAsignadoDto);
  }

  @Get()
  findAll() {
    return this.horariosAsignadosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.horariosAsignadosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHorariosAsignadoDto: UpdateHorariosAsignadoDto) {
    return this.horariosAsignadosService.update(+id, updateHorariosAsignadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.horariosAsignadosService.remove(+id);
  }
}
