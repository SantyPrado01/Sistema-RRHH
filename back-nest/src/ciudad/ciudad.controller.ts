import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';

@Controller('ciudad')
export class CiudadController {
  constructor(private readonly ciudadService: CiudadService) {}

  @Post()
  create(@Body() createCiudadDto: CreateCiudadDto) {
    return this.ciudadService.createCiudad(createCiudadDto);
  }

  @Get()
  findAll() {
    return this.ciudadService.getCiudades();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ciudadService.getCiudad(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCiudadDto: UpdateCiudadDto) {
    return this.ciudadService.updateCiudad(+id, updateCiudadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.ciudadService.deleteCiudad(id);
  }
}
