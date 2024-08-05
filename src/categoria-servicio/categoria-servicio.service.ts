import { Injectable } from '@nestjs/common';
import { CreateCategoriaServicioDto } from './dto/create-categoria-servicio.dto';
import { UpdateCategoriaServicioDto } from './dto/update-categoria-servicio.dto';

@Injectable()
export class CategoriaServicioService {
  create(createCategoriaServicioDto: CreateCategoriaServicioDto) {
    return 'This action adds a new categoriaServicio';
  }

  findAll() {
    return `This action returns all categoriaServicio`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriaServicio`;
  }

  update(id: number, updateCategoriaServicioDto: UpdateCategoriaServicioDto) {
    return `This action updates a #${id} categoriaServicio`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriaServicio`;
  }
}
