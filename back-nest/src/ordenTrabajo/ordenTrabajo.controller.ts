import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query } from '@nestjs/common';
import { OrdenTrabajoService } from './ordenTrabajo.service'; 
import { CreateOrdenTrabajoDto } from './dto/createOrdenTrabajo.dto'; 
import { UpdateOrdenTrabajoDto } from './dto/updateOrdenTrabajo.dto'; 
import { OrdenTrabajo } from './entities/ordenTrabajo.entity'; 

@Controller('ordenTrabajo')
export class OrdenTrabajoController {
  constructor(private readonly ordenTrabajoService: OrdenTrabajoService) {}

  @Post()
  async create(@Body() createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo> {

    const ordenTrabajo = await this.ordenTrabajoService.createOrdenTrabajo(createOrdenTrabajoDto);
    if (!ordenTrabajo) throw new NotFoundException('No se pudo crear la orden de trabajo');

    const ordenTrabajoId = ordenTrabajo.Id;

    await this.ordenTrabajoService.createNecesidadHoraria(
      ordenTrabajoId,
      createOrdenTrabajoDto.necesidadHoraria.map(necesidad => ({
        ordenTrabajoId,
        diaSemana: necesidad.diaSemana,
        horaInicio: necesidad.horaInicio,
        horaFin: necesidad.horaFin,
      })),
    );

    await this.ordenTrabajoService.createAsignarHorarios(ordenTrabajoId);

    return this.ordenTrabajoService.findOne(ordenTrabajoId);
  }

  @Get()
  findAll() {
    return this.ordenTrabajoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenTrabajoService.findOne(+id);
  }

  @Get('findByMesAnio/:mes/:anio/:completado')
  async obtenerOrdenesPorMesYAnio(
  @Param('mes') mes: string, 
  @Param('anio') anio: string,
  @Param('completado') completado: boolean
  ): Promise<OrdenTrabajo[]> {
  const mesNumero = parseInt(mes, 10);
  const anioNumero = parseInt(anio, 10);

  if (isNaN(mesNumero) || isNaN(anioNumero)) {
    throw new Error('Mes o Año no válidos');
  }

    return this.ordenTrabajoService.findMesAnio(mesNumero, anioNumero, completado);
  }

  @Get('horas-mes/:mes/:anio/:completado')
  async obtenerHorasPorMes(
    @Param('mes') mes: number,
    @Param('anio') anio: number,
    @Param('completado') completado: boolean
  ) {
    return await this.ordenTrabajoService.obtenerHorasPorMes(mes, anio, completado);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenTrabajoDto: UpdateOrdenTrabajoDto) {
    return this.ordenTrabajoService.update(+id, updateOrdenTrabajoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenTrabajoService.remove(+id);
  }
}