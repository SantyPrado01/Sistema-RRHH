import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateItemsFacturaDto } from './dto/create-items-factura.dto';
import { UpdateItemsFacturaDto } from './dto/update-items-factura.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsFactura } from './entities/items-factura.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ItemsFacturasService {
  constructor(
    @InjectRepository(ItemsFactura)
    private readonly itemsFacturaRepository: Repository<ItemsFactura>,
  ) {}

  async create(createItemsFacturaDto: CreateItemsFacturaDto) {
    try {
      const newItem = this.itemsFacturaRepository.create(createItemsFacturaDto);
      await this.itemsFacturaRepository.save(newItem);
      return { message: 'Item de factura creado con éxito', item: newItem };
    } catch (error) {
      throw new HttpException('Error al crear el item de factura', HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const items = await this.itemsFacturaRepository.find();
      return items;
    } catch (error) {
      throw new HttpException('Error al obtener los items de factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    try {
      const item = await this.itemsFacturaRepository.findOne({where: { id }});
      if (!item) {
        throw new HttpException('Item de factura no encontrado', HttpStatus.NOT_FOUND);
      }
      return item;
    } catch (error) {
      throw new HttpException('Error al obtener el item de factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, updateItemsFacturaDto: UpdateItemsFacturaDto) {
    try {
      const item = await this.itemsFacturaRepository.findOne({where: { id }});
      if (!item) {
        throw new HttpException('Item de factura no encontrado', HttpStatus.NOT_FOUND);
      }
      const updatedItem = Object.assign(item, updateItemsFacturaDto);
      await this.itemsFacturaRepository.save(updatedItem);
      return { message: 'Item de factura actualizado con éxito', item: updatedItem };
    } catch (error) {
      throw new HttpException('Error al actualizar el item de factura', HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const item = await this.itemsFacturaRepository.findOne({where: { id }});
      if (!item) {
        throw new HttpException('Item de factura no encontrado', HttpStatus.NOT_FOUND);
      }
      await this.itemsFacturaRepository.remove(item);
      return { message: 'Item de factura eliminado con éxito' };
    } catch (error) {
      throw new HttpException('Error al eliminar el item de factura', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
