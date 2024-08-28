import { Injectable } from '@nestjs/common';
import { CreateDisponibilidadHorariaDto } from './dto/create-disponibilidad-horaria.dto';
import { UpdateDisponibilidadHorariaDto } from './dto/update-disponibilidad-horaria.dto';

@Injectable()
export class DisponibilidadHorariaService {
  create(createDisponibilidadHorariaDto: CreateDisponibilidadHorariaDto) {
    return 'This action adds a new disponibilidadHoraria';
  }

  findAll() {
    return `This action returns all disponibilidadHoraria`;
  }

  findOne(id: number) {
    return `This action returns a #${id} disponibilidadHoraria`;
  }

  update(id: number, updateDisponibilidadHorariaDto: UpdateDisponibilidadHorariaDto) {
    return `This action updates a #${id} disponibilidadHoraria`;
  }

  remove(id: number) {
    return `This action removes a #${id} disponibilidadHoraria`;
  }
}
