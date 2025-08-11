import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HorarioAsignadoService } from './horariosAsignados.service'; 
import { CreateHorariosAsignadoDto } from './dto/createHorariosAsignados.dto'; 
import { UpdateHorariosAsignadoDto } from './dto/updateHorariosAsignados.entity'; 
import { HorarioAsignado } from './entities/horariosAsignados.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { ResumenGeneral } from './horariosAsignados.service';

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

  @Get('cantidadHorasPorEmpleado')
  async obtenerEmpleadosDelDia(): Promise<{ empleado: Empleado; totalHoras: number }[]> {
    return this.horariosAsignadosService.obtenerEmpleadosOrdenadosPorDiaActual();
  }

  @Get('buscarPorEmpleado/:empleadoId')
  async obtenerHorariosPorEmpleado(
    @Param('empleadoId') empleadoId: number,
    @Query('mes') mes?: number,
    @Query('anio') anio?: number,
  ): Promise<{ horarios: HorarioAsignado[] }> {
    return this.horariosAsignadosService.obtenerHorariosPorEmpleadoRefactorizado(
      empleadoId,
      mes,
      anio,
    );
  }
  @Get('buscarPorEmpresa/:empresaId')
  async obtenerHorariosPorEmpresa(
    @Param('empresaId') empresaId: number,
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ): Promise<{ horarios: HorarioAsignado[]; conteo: Record<string, number> }> {
    return this.horariosAsignadosService.obtenerHorariosPorEmpresa(
      empresaId,
      fechaInicio,
      fechaFin,
    );
  }

  @Get('buscar')
  buscarHorarios(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('empleadoId') empleadoIdStr?: string,
    @Query('servicioId') servicioIdStr?: string,
  ) {
    const empleadoId = empleadoIdStr ? Number(empleadoIdStr) : undefined;
    const servicioId = servicioIdStr ? Number(servicioIdStr) : undefined;
  
    return this.horariosAsignadosService.buscarHorariosAsignados(
      fechaInicio,
      fechaFin,
      empleadoId,
      servicioId,
    );
  }

  @Get('buscarPorFecha')
  obtenerResumenPorEmpresa(
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
    @Query('servicioId') servicioIdStr?: string,
  ) {

    const empresaId = servicioIdStr ? Number(servicioIdStr) : undefined;
  
    return this.horariosAsignadosService.obtenerResumenPorEmpresa(
      fechaInicio,
      fechaFin,
      empresaId
    );
  }

  @Get('obtenerResumenPorServicio/:mes/:anio')
  async obtenerResumenPorServicio(
    @Param('mes') mes: string,
    @Param('anio') anio: string,
  ): Promise<ResumenGeneral> { // ← Cambiar este tipo de retorno
    const mesNumero = parseInt(mes, 10);
    const anioNumero = parseInt(anio, 10);

    if (isNaN(mesNumero) || isNaN(anioNumero)) {
      throw new Error('Mes o Año no válidos');
    }

    return this.horariosAsignadosService.obtenerResumenPorServicio(
      mesNumero,
      anioNumero
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