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
  // Crear la orden de trabajo
  const ordenTrabajo = await this.ordenTrabajoService.createOrdenTrabajo(createOrdenTrabajoDto);
  if (!ordenTrabajo) throw new NotFoundException('No se pudo crear la orden de trabajo');
  
  const ordenTrabajoId = ordenTrabajo.Id;
  
  // Si se ha pasado diaEspecifico, los horarios se asignan directamente a la orden de trabajo
  if (createOrdenTrabajoDto.diaEspecifico) {
    // Crear y asignar los horarios únicos para el día específico
    await this.ordenTrabajoService.createAsignarHorarioUnico(
      ordenTrabajoId,
      createOrdenTrabajoDto.diaEspecifico,
      createOrdenTrabajoDto.horaInicio,
      createOrdenTrabajoDto.horaFin
    );
  } else {
    // Si no se pasa un día específico, crear la necesidad horaria para los días de la semana
    await this.ordenTrabajoService.createNecesidadHoraria(
      ordenTrabajoId,
      createOrdenTrabajoDto.necesidadHoraria.map(necesidad => ({
        ordenTrabajoId,
        diaSemana: necesidad.diaSemana,
        horaInicio: necesidad.horaInicio,
        horaFin: necesidad.horaFin,
      }))
    );
    // Crear la asignación de horarios según las necesidades horarias
    await this.ordenTrabajoService.createAsignarHorarios(ordenTrabajoId);
  }

  // Retornar la orden de trabajo completa
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

  @Get('findForEmpleado/:mes/:anio/:completado/:empleadoId')
  async findForEmpleado(
    @Param('mes') mes: string,
    @Param('anio') anio: string,
    @Param('completado') completado: string,
    @Param('empleadoId') empleadoId: string
  ): Promise<any> {
    const mesNumero = parseInt(mes, 10);
    const anioNumero = parseInt(anio, 10);
    const empleadoIdNumero = parseInt(empleadoId, 10);
    const completadoBool = completado.toLowerCase() === 'true'; 

    if (isNaN(mesNumero) || isNaN(anioNumero) || isNaN(empleadoIdNumero)) {
      throw new Error('Mes, Año o ID de Empleado no válidos');
    }
    return await this.ordenTrabajoService.findForEmpleado(
      mesNumero,
      anioNumero,
      completadoBool,
      empleadoIdNumero
    );
  }

  @Get('findForServicio/:mes/:anio/:completado/:servicioId')
  async findForServicio(
    @Param('mes') mes: string,
    @Param('anio') anio: string,
    @Param('completado') completado: string,
    @Param('servicioId') servicioId: string
  ): Promise<any> {
    const mesNumero = parseInt(mes, 10);
    const anioNumero = parseInt(anio, 10);
    const servicioIdNumero = parseInt(servicioId, 10);
    const completadoBool = completado.toLowerCase() === 'true'; 

    if (isNaN(mesNumero) || isNaN(anioNumero) || isNaN(servicioIdNumero)) {
      console.log('Mes:',mesNumero)
      console.log('Mes:',anioNumero)
      console.log('Mes:',servicioIdNumero)
      throw new Error('Mes, Año o ID de Empleado no válidos');
    }
    return await this.ordenTrabajoService.findForServicio(
      mesNumero,
      anioNumero,
      completadoBool,
      servicioIdNumero
    );
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