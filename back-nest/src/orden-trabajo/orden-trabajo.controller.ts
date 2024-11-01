import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { OrdenTrabajoService } from './orden-trabajo.service';
import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/update-orden-trabajo.dto';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
import { CreateNecesidadHorariaDto } from 'src/necesidad-horaria/dto/create-necesidad-horaria.dto';

@Controller('ordenTrabajo')
export class OrdenTrabajoController {
  constructor(private readonly ordenTrabajoService: OrdenTrabajoService) {}

  @Post()
  async create(@Body() createOrdenTrabajoDto: CreateOrdenTrabajoDto): Promise<OrdenTrabajo> {
    // Crear la orden de trabajo y obtener su ID
    const ordenTrabajo = await this.ordenTrabajoService.create(createOrdenTrabajoDto);
    if (!ordenTrabajo) throw new NotFoundException('No se pudo crear la orden de trabajo');

    // Obtener el ID de la orden de trabajo recién creada
    const ordenTrabajoId = ordenTrabajo.ordenTrabajoId;

    // Asignar las necesidades horarias al servicio como un array
    await this.ordenTrabajoService.addNecesidadHoraria(
      ordenTrabajoId,
      createOrdenTrabajoDto.necesidadHoraria.map(necesidad => ({
        ordenTrabajoId,
        diaSemana: necesidad.diaSemana,
        horaInicio: necesidad.horaInicio,
        horaFin: necesidad.horaFin,
      })),
    );

    // Asignar los horarios en base a las necesidades horarias
    await this.ordenTrabajoService.asignarHorarios(ordenTrabajoId);

    // Retornar la orden de trabajo creada junto con sus relaciones actualizadas
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenTrabajoDto: UpdateOrdenTrabajoDto) {
    return this.ordenTrabajoService.update(+id, updateOrdenTrabajoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenTrabajoService.remove(+id);
  }
}
