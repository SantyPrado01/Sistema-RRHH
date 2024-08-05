import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaEmpleadoService } from './categoria-empleado.service';
import { CreateCategoriaEmpleadoDto } from './dto/create-categoria-empleado.dto';
import { UpdateCategoriaEmpleadoDto } from './dto/update-categoria-empleado.dto';

@Controller('categoria-empleado')
export class CategoriaEmpleadoController {
  constructor(private readonly categoriaEmpleadoService: CategoriaEmpleadoService) {}

  @Post()
  create(@Body() createCategoriaEmpleadoDto: CreateCategoriaEmpleadoDto) {
    return this.categoriaEmpleadoService.create(createCategoriaEmpleadoDto);
  }

  @Get()
  findAll() {
    return this.categoriaEmpleadoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaEmpleadoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaEmpleadoDto: UpdateCategoriaEmpleadoDto) {
    return this.categoriaEmpleadoService.update(+id, updateCategoriaEmpleadoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaEmpleadoService.remove(+id);
  }
}
