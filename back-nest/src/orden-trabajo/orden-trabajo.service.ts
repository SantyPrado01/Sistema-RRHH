import { Injectable } from '@nestjs/common';
import { CreateOrdenTrabajoDto } from './dto/create-orden-trabajo.dto';
import { UpdateOrdenTrabajoDto } from './dto/update-orden-trabajo.dto';

@Injectable()
export class OrdenTrabajoService {
  create(createOrdenTrabajoDto: CreateOrdenTrabajoDto) {
    return 'This action adds a new ordenTrabajo';
  }

  findAll() {
    return `This action returns all ordenTrabajo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordenTrabajo`;
  }

  update(id: number, updateOrdenTrabajoDto: UpdateOrdenTrabajoDto) {
    return `This action updates a #${id} ordenTrabajo`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordenTrabajo`;
  }
}
