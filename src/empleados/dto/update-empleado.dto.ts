import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDto } from './create-empleado.dto';

export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {

    legajo?: number
    nombre?: string
    apellido?: string
    nroDocumento?: number
    telefono?: number
    email?: string
    fechaIngreso?: Date
    eliminado?: boolean
    categoriasID?: number
    disponibilidadID?: number
    ciudadID?: number
}
