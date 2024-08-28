import { Module } from '@nestjs/common';
import { ItemsFacturasService } from './items-facturas.service';
import { ItemsFacturasController } from './items-facturas.controller';

@Module({
  controllers: [ItemsFacturasController],
  providers: [ItemsFacturasService],
})
export class ItemsFacturasModule {}
