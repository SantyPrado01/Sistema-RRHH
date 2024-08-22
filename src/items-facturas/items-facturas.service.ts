import { Injectable } from '@nestjs/common';
import { CreateItemsFacturaDto } from './dto/create-items-factura.dto';
import { UpdateItemsFacturaDto } from './dto/update-items-factura.dto';

@Injectable()
export class ItemsFacturasService {
  create(createItemsFacturaDto: CreateItemsFacturaDto) {
    return 'This action adds a new itemsFactura';
  }

  findAll() {
    return `This action returns all itemsFacturas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemsFactura`;
  }

  update(id: number, updateItemsFacturaDto: UpdateItemsFacturaDto) {
    return `This action updates a #${id} itemsFactura`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemsFactura`;
  }
}
