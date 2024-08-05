import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DisponibilidadHorariaService } from './disponibilidad-horaria.service';
import { CreateDisponibilidadHorariaDto } from './dto/create-disponibilidad-horaria.dto';
import { UpdateDisponibilidadHorariaDto } from './dto/update-disponibilidad-horaria.dto';

@Controller('disponibilidad-horaria')
export class DisponibilidadHorariaController {
  constructor(private readonly disponibilidadHorariaService: DisponibilidadHorariaService) {}

  @Post()
  create(@Body() createDisponibilidadHorariaDto: CreateDisponibilidadHorariaDto) {
    return this.disponibilidadHorariaService.create(createDisponibilidadHorariaDto);
  }

  @Get()
  findAll() {
    return this.disponibilidadHorariaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.disponibilidadHorariaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDisponibilidadHorariaDto: UpdateDisponibilidadHorariaDto) {
    return this.disponibilidadHorariaService.update(+id, updateDisponibilidadHorariaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.disponibilidadHorariaService.remove(+id);
  }
}
