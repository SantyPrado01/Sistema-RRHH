import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDto } from './create-empleado.dto';

export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {

    legajo?: number
    nombre?: string
    apellido?: string
    nroDocumento?: number
    telefono?: string
    email?: string
    fechaIngreso?: Date
    eliminado?: boolean
    ciudad?: number
    observaciones?: string;
    categoriasID?: number
    disponibilidadID?: number
    
}
