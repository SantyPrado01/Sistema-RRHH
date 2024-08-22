import { PartialType } from '@nestjs/mapped-types';
import { CreateItemsFacturaDto } from './create-items-factura.dto';

export class UpdateItemsFacturaDto extends PartialType(CreateItemsFacturaDto) {

    id?: number
    descripcion?: string;
    valor?: number;
    facturaId?: number;
    
}
