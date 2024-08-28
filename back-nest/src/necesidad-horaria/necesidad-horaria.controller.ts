import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NecesidadHorariaService } from './necesidad-horaria.service';
import { CreateNecesidadHorariaDto } from './dto/create-necesidad-horaria.dto';
import { UpdateNecesidadHorariaDto } from './dto/update-necesidad-horaria.dto';

@Controller('necesidad-horaria')
export class NecesidadHorariaController {
  constructor(private readonly necesidadHorariaService: NecesidadHorariaService) {}

  @Post()
  create(@Body() createNecesidadHorariaDto: CreateNecesidadHorariaDto) {
    return this.necesidadHorariaService.create(createNecesidadHorariaDto);
  }

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
