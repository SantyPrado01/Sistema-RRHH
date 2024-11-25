import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaUsuarioService } from './categoria-usuario.service';
import { CreateCategoriaUsuarioDto } from './dto/create-categoria-usuario.dto';
import { UpdateCategoriaUsuarioDto } from './dto/update-categoria-usuario.dto';

@Controller('categoria-usuario')
export class CategoriaUsuarioController {
  constructor(private readonly categoriaUsuarioService: CategoriaUsuarioService) {}

  @Post()
  create(@Body() createCategoriaUsuarioDto: CreateCategoriaUsuarioDto) {
    return this.categoriaUsuarioService.create(createCategoriaUsuarioDto);
  }

  @Get()
  findAll() {
    return this.categoriaUsuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaUsuarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaUsuarioDto: UpdateCategoriaUsuarioDto) {
    return this.categoriaUsuarioService.update(+id, updateCategoriaUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaUsuarioService.remove(+id);
  }
}
