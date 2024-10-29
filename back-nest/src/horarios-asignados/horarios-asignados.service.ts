import { Injectable } from '@nestjs/common';
import { CreateHorariosAsignadoDto } from './dto/create-horarios-asignado.dto';
import { UpdateHorariosAsignadoDto } from './dto/update-horarios-asignado.dto';

@Injectable()
export class HorariosAsignadosService {
  create(createHorariosAsignadoDto: CreateHorariosAsignadoDto) {
    return 'This action adds a new horariosAsignado';
  }

  findAll() {
    return `This action returns all horariosAsignados`;
  }

  findOne(id: number) {
    return `This action returns a #${id} horariosAsignado`;
  }

  update(id: number, updateHorariosAsignadoDto: UpdateHorariosAsignadoDto) {
    return `This action updates a #${id} horariosAsignado`;
  }

  remove(id: number) {
    return `This action removes a #${id} horariosAsignado`;
  }
}
