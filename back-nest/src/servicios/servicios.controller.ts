import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ServiciosService } from './servicios.service';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Controller('servicios')
export class ServiciosController {
  constructor(private readonly serviciosService: ServiciosService) {}

  @Post()
  create(@Body() createServicioDto: CreateServicioDto) {
    return this.serviciosService.createServicio(createServicioDto);
  }

  @Get('buscar')
  buscar(@Query('nombre') termino: string) {
    return this.serviciosService.buscarPorNombre(termino);
  }

  @Get()
  findAll() {
    return this.serviciosService.getServicios();
  }

  @Get('/true')
  getServiciosEliminado(){
    return this.serviciosService.getServiciosEliminado();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviciosService.getServicioId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServicioDto: UpdateServicioDto) {
    return this.serviciosService.updateServicio(+id, updateServicioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviciosService.deleteServicio(+id);
  }
}
