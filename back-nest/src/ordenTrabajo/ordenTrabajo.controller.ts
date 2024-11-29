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

  @Get('findForEmpleado/:mes/:anio/:empleadoId')
  async findForEmpleado(
    @Param('mes') mes: string,
    @Param('anio') anio: string,
    @Param('completado') completado: string,
    @Param('empleadoId') empleadoId: string
  ): Promise<any> {
    const mesNumero = parseInt(mes, 10);
    const anioNumero = parseInt(anio, 10);
    const empleadoIdNumero = parseInt(empleadoId, 10);

    if (isNaN(mesNumero) || isNaN(anioNumero) || isNaN(empleadoIdNumero)) {
      throw new Error('Mes, Año o ID de Empleado no válidos');
    }
    return await this.ordenTrabajoService.findForEmpleado(
      mesNumero,
      anioNumero,
      empleadoIdNumero
    );
  }

  @Get('findForServicio/:mes/:anio/:servicioId')
  async findForServicio(
    @Param('mes') mes: string,
    @Param('anio') anio: string,
    @Param('servicioId') servicioId: string
  ): Promise<any> {
    const mesNumero = parseInt(mes, 10);
    const anioNumero = parseInt(anio, 10);
    const servicioIdNumero = parseInt(servicioId, 10);

    if (isNaN(mesNumero) || isNaN(anioNumero) || isNaN(servicioIdNumero)) {
      console.log('Mes:',mesNumero)
      console.log('Mes:',anioNumero)
      console.log('Mes:',servicioIdNumero)
      throw new Error('Mes, Año o ID de Empleado no válidos');
    }
    return await this.ordenTrabajoService.findForServicio(
      mesNumero,
      anioNumero,
      servicioIdNumero
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
}