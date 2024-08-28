import { PartialType } from '@nestjs/mapped-types';
import { CreateServicioDto } from './create-servicio.dto';

export class UpdateServicioDto extends PartialType(CreateServicioDto) {

    nombre?: string
    CUIT?: number
    direccion?: string
    ciudadID?: number
    telefono?: number
    categoriaID?: number
    descripcion?: string
    eliminado?: boolean
    necesidadHorariaID?:number

}
