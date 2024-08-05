import { Injectable } from '@nestjs/common';
import { CreateCategoriaEmpleadoDto } from './dto/create-categoria-empleado.dto';
import { UpdateCategoriaEmpleadoDto } from './dto/update-categoria-empleado.dto';

@Injectable()
export class CategoriaEmpleadoService {
  create(createCategoriaEmpleadoDto: CreateCategoriaEmpleadoDto) {
    return 'This action adds a new categoriaEmpleado';
  }

  findAll() {
    return `This action returns all categoriaEmpleado`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriaEmpleado`;
  }

  update(id: number, updateCategoriaEmpleadoDto: UpdateCategoriaEmpleadoDto) {
    return `This action updates a #${id} categoriaEmpleado`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriaEmpleado`;
  }
}
