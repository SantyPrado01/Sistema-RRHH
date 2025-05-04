import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HorarioAsignadoService } from './horariosAsignados.service'; 
import { CreateHorariosAsignadoDto } from './dto/createHorariosAsignados.dto'; 
import { UpdateHorariosAsignadoDto } from './dto/updateHorariosAsignados.entity'; 
import { HorarioAsignado } from './entities/horariosAsignados.entity';

@Controller('horariosAsignados')
export class HorariosAsignadosController {
  constructor(private readonly horariosAsignadosService: HorarioAsignadoService) {}
  
  @Post()
  create(@Body() createHorariosDto: CreateHorariosAsignadoDto) {
    return this.horariosAsignadosService.create(createHorariosDto);
  }

  @Get()
  async getHorariosAsignados():Promise<HorarioAsignado[]> {
    return this.horariosAsignadosService.getHorariosAsignados(); 
  }

  @Get('buscar')
  buscarHorarios(
    @Query('fecha') fecha?: string,
    @Query('empleadoId') empleadoIdStr?: string,
    @Query('servicioId') servicioIdStr?: string,
  ) {
    console.log('Query:', { fecha, empleadoIdStr, servicioIdStr });
    const empleadoId = empleadoIdStr ? Number(empleadoIdStr) : undefined;
    const servicioId = servicioIdStr ? Number(servicioIdStr) : undefined;
  
    return this.horariosAsignadosService.buscarHorariosAsignados(
      fecha,
      empleadoId,
      servicioId,
    );
  }
  @Get('/all')
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