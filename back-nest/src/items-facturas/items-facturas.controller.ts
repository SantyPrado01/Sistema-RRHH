import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsFacturasService } from './items-facturas.service';
import { CreateItemsFacturaDto } from './dto/create-items-factura.dto';
import { UpdateItemsFacturaDto } from './dto/update-items-factura.dto';

@Controller('items-facturas')
export class ItemsFacturasController {
  constructor(private readonly itemsFacturasService: ItemsFacturasService) {}

  @Post()
  create(@Body() createItemsFacturaDto: CreateItemsFacturaDto) {
    return this.itemsFacturasService.create(createItemsFacturaDto);
  }

  @Get()
  findAll() {
    return this.itemsFacturasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsFacturasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemsFacturaDto: UpdateItemsFacturaDto) {
    return this.itemsFacturasService.update(+id, updateItemsFacturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsFacturasService.remove(+id);
  }
}
