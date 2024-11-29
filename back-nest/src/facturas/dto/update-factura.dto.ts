import { PartialType } from '@nestjs/mapped-types';
import { CreateFacturaDto } from './create-factura.dto';
import { CreateItemsFacturaDto } from 'src/items-facturas/dto/create-items-factura.dto';

export class UpdateFacturaDto extends PartialType(CreateFacturaDto) {

    numero?: number;
    fecha?: Date;
    total?: number;
    servicioId?: number;
    items?: CreateItemsFacturaDto[];

}
