import { PartialType } from '@nestjs/mapped-types';
import { CreateFacturaDto } from './create-factura.dto';

export class UpdateFacturaDto extends PartialType(CreateFacturaDto) {

    numero?: number;
    fecha?: Date;
    total?: number;
    servicioId?: number;
    itemsFacturaId?: number;

}
