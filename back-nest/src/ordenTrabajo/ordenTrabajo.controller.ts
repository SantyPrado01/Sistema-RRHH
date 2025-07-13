import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, Query, HttpException, HttpStatus } from '@nestjs/common';
import { OrdenTrabajoService } from './ordenTrabajo.service'; 
import { CreateOrdenTrabajoDto } from './dto/createOrdenTrabajo.dto'; 
import { UpdateOrdenTrabajoDto } from './dto/updateOrdenTrabajo.dto'; 
import { OrdenTrabajo } from './entities/ordenTrabajo.entity'; 

export class EditarEmpleadoOrdenTrabajoDto {
    nuevoEmpleadoId?: number;
    fechaCambio: Date;
    renovacionAutomatica: boolean;
}

@Controller('ordenTrabajo')
export class OrdenTrabajoController {
  constructor(private readonly ordenTrabajoService: OrdenTrabajoService) {}

  @Post()
  async create(
    @Body() createOrdenTrabajoDto: CreateOrdenTrabajoDto,
    @Body('fechaDesde') fechaDesde: string,
    @Body('fechaHasta') fechaHasta:string,
  ){
    try{
      const ordenesTrabajo = await this.ordenTrabajoService.createOrdenesTrabajo(
        createOrdenTrabajoDto,
        fechaDesde,
        fechaHasta
      );
      return ordenesTrabajo;
    }
    catch(error){
      throw new NotFoundException(error.message);
    }
  }

  @Post('renovarOrdenesManualmente')
  async ejecutarRenovacionManual(): Promise<OrdenTrabajo[]> {
    return this.ordenTrabajoService.ejecutarRenovacionManual();
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

  @Patch(':id/editar')
  async editarOrdenTrabajo(
    @Param('id') ordenTrabajoId: string,
    @Body() editarDto: EditarEmpleadoOrdenTrabajoDto
  ) {
    try {
      const idOrden = parseInt(ordenTrabajoId);
      if (isNaN(idOrden) || idOrden <= 0) {
        throw new HttpException('El ID de la orden de trabajo debe ser un número válido', HttpStatus.BAD_REQUEST);
      }

      const empleadoId = editarDto.nuevoEmpleadoId;
      if (!empleadoId || isNaN(empleadoId) || empleadoId <= 0) {
        throw new HttpException('El ID del nuevo empleado debe ser válido', HttpStatus.BAD_REQUEST);
      }

      const renovacionAutomatica = editarDto.renovacionAutomatica ?? false;

      const fechaCambio = new Date();
      fechaCambio.setHours(0, 0, 0, 0);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaCambio < hoy) {
        throw new HttpException('La fecha de cambio no puede ser en el pasado', HttpStatus.BAD_REQUEST);
      }

      const resultado = await this.ordenTrabajoService.editarOrdenTrabajo(
        idOrden,
        fechaCambio,
        renovacionAutomatica,
        empleadoId
      );

      return {
        success: true,
        message: 'Empleado de orden de trabajo actualizado exitosamente',
        data: {
          ordenTrabajoId: resultado.ordenActualizada.Id,
          nuevoEmpleadoId: resultado.ordenActualizada.empleadoAsignado.Id,
          nuevoEmpleadoNombre: resultado.ordenActualizada.empleadoAsignado.nombre,
          renovacionAutomatica: resultado.ordenActualizada.renovacionAutomatica,
          fechaCambio: fechaCambio.toISOString().split('T')[0],
          horariosActualizados: resultado.horariosActualizados
        }
      };

    } catch (error) {
      console.error('Error en editarEmpleadoOrdenTrabajo:', error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(error.message || 'Error interno del servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  @Delete('deletedef/:id')
  remove(@Param('id') id: string) {
    return this.ordenTrabajoService.deleteOrdenTrabajo(+id);
  }

  @Patch('delete/:id')
  deleteLogico(@Param('id') id: number) {
    return this.ordenTrabajoService.delete(+id);
  }
}