import { Injectable } from '@nestjs/common';
import { CreateNecesidadHorariaDto } from './dto/create-necesidad-horaria.dto';
import { UpdateNecesidadHorariaDto } from './dto/update-necesidad-horaria.dto';

@Injectable()
export class NecesidadHorariaService {
  create(createNecesidadHorariaDto: CreateNecesidadHorariaDto) {
    return 'This action adds a new necesidadHoraria';
  }

  findAll() {
    return `This action returns all necesidadHoraria`;
  }

  findOne(id: number) {
    return `This action returns a #${id} necesidadHoraria`;
  }

  update(id: number, updateNecesidadHorariaDto: UpdateNecesidadHorariaDto) {
    return `This action updates a #${id} necesidadHoraria`;
  }

  remove(id: number) {
    return `This action removes a #${id} necesidadHoraria`;
  }
}
