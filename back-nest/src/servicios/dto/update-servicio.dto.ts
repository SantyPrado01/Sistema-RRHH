import { PartialType } from '@nestjs/mapped-types';
import { CreateServicioDto } from './create-servicio.dto';

export class UpdateServicioDto extends PartialType(CreateServicioDto) {

    nombre?: string;
    cuit?: string;
    direccion?: string;
    ciudadID?: number;
    telefono?: string;
    horasFijas?: string;
    categoria?: number;
    descripcion?: string;
    eliminado?: boolean;
    necesidadHorariaID?:number;

}
