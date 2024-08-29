import { Module } from '@nestjs/common';
import { ItemsFacturasService } from './items-facturas.service';
import { ItemsFacturasController } from './items-facturas.controller';
import { ItemsFactura } from './entities/items-factura.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ItemsFactura])],
  controllers: [ItemsFacturasController],
  providers: [ItemsFacturasService],
})
export class ItemsFacturasModule {}
