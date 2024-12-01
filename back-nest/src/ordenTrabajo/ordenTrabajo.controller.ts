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
  if (createOrdenTrabajoDto.diaEspecifico) {
    await this.ordenTrabajoService.createAsignarHorarioUnico(
      ordenTrabajoId,
      createOrdenTrabajoDto.diaEspecifico,
      createOrdenTrabajoDto.horaInicio,
      createOrdenTrabajoDto.horaFin
    );
  } else {
    await this.ordenTrabajoService.createNecesidadHoraria(
      ordenTrabajoId,
      createOrdenTrabajoDto.necesidadHoraria.map(necesidad => ({
        ordenTrabajoId,
        diaSemana: necesidad.diaSemana,
        horaInicio: necesidad.horaInicio,
        horaFin: necesidad.horaFin,
      }))
    );
    await this.ordenTrabajoService.createAsignarHorarios(ordenTrabajoId);
  }
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

  @Get('findByMesAnio/:mes/:anio')
  async obtenerOrdenesPorMesYAnio(
  @Param('mes') mes: string, 
  @Param('anio') anio: string,
  ): Promise<OrdenTrabajo[]> {
  const mesNumero = parseInt(mes, 10);
  const anioNumero = parseInt(anio, 10);

  if (isNaN(mesNumero) || isNaN(anioNumero)) {
    throw new Error('Mes o Año no válidos');
  }
    return this.ordenTrabajoService.findMesAnio(mesNumero, anioNumero);
  }

  @Get('findForEmpleado/:empleadoId')
  async findForEmpleado(
    @Param('empleadoId') empleadoId: string
  ): Promise<any> {
    const empleadoIdNumero = parseInt(empleadoId, 10);

    if (isNaN(empleadoIdNumero)) {
      throw new Error('Mes, Año o ID de Empleado no válidos');
    }
    return await this.ordenTrabajoService.findForEmpleado(
      empleadoIdNumero
    );
  }

  @Get('findByMesAnioEmpleado/:empleadoId/:mes/:anio')
  async getOrdenesByEmpleadoAndDate(
    @Param('empleadoId') empleadoId: number,
    @Param('mes') mes: number,
    @Param('anio') anio: number,
  ) {
    return await this.ordenTrabajoService.findForEmpleadoByMonthAndYear(
      empleadoId,
      mes,
      anio,
    );
  }

  @Get('findForServicio/:servicioId')
  async findForServicio(
    @Param('servicioId') servicioId: string
  ): Promise<any> {

    const servicioIdNumero = parseInt(servicioId, 10);

    if (isNaN(servicioIdNumero)) {
      console.log('Mes:',servicioIdNumero)
      throw new Error('Mes, Año o ID de Empleado no válidos');
    }
    return await this.ordenTrabajoService.findForServicio(
      servicioIdNumero
    );
  }

  @Get('findByMesAnioServicio/:servicioId/:mes/:anio')
  async getOrdenesByServicioAndDate(
    @Param('servicioId') servicioId: number,
    @Param('mes') mes: number,
    @Param('anio') anio: number,
  ) {
    return await this.ordenTrabajoService.findForServicioByMonthAndYear(
      servicioId,
      mes,
      anio,
    );
  }

  @Get('horas-mes/:mes/:anio')
  async obtenerHorasPorMes(
    @Param('mes') mes: number,
    @Param('anio') anio: number,
  ) {
    return await this.ordenTrabajoService.obtenerHorasPorMes(mes, anio);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenTrabajoDto: UpdateOrdenTrabajoDto) {
    return this.ordenTrabajoService.update(+id, updateOrdenTrabajoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenTrabajoService.deleteOrdenTrabajo(+id);
  }

  @Patch('delete/:id')
  deleteLogico(@Param('id') id: number) {
    return this.ordenTrabajoService.delete(+id);
  }
}