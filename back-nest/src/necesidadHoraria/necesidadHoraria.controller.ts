import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NecesidadHorariaService } from './necesidadHoraria.service'; 
import { UpdateNecesidadHorariaDto } from './dto/updateNecesidadHoraria.dto'; 

@Controller('necesidad-horaria')
export class NecesidadHorariaController {
  constructor(private readonly necesidadHorariaService: NecesidadHorariaService) {}

  @Get()
  findAll() {
    return this.necesidadHorariaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.necesidadHorariaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNecesidadHorariaDto: UpdateNecesidadHorariaDto) {
    return this.necesidadHorariaService.update(+id, updateNecesidadHorariaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.necesidadHorariaService.remove(+id);
  }
}