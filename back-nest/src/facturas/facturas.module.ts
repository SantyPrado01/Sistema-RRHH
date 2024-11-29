import { Module } from '@nestjs/common';
import { FacturasService } from './facturas.service';
import { FacturasController } from './facturas.controller';
import { Factura } from './entities/factura.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsFactura } from 'src/items-facturas/entities/items-factura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Factura, ItemsFactura])],
  controllers: [FacturasController],
  providers: [FacturasService],
})
export class FacturasModule {}
