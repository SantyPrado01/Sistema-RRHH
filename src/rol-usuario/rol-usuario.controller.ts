import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RolUsuarioService } from './rol-usuario.service';
import { CreateRolUsuarioDto } from './dto/create-rol-usuario.dto';
import { UpdateRolUsuarioDto } from './dto/update-rol-usuario.dto';

@Controller('rol-usuario')
export class RolUsuarioController {
  constructor(private readonly rolUsuarioService: RolUsuarioService) {}

  @Post()
  create(@Body() createRolUsuarioDto: CreateRolUsuarioDto) {
    return this.rolUsuarioService.create(createRolUsuarioDto);
  }

  @Get()
  findAll() {
    return this.rolUsuarioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolUsuarioService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRolUsuarioDto: UpdateRolUsuarioDto) {
    return this.rolUsuarioService.update(+id, updateRolUsuarioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolUsuarioService.remove(+id);
  }
}
