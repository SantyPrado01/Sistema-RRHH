import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDto } from './create-empleado.dto';

export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {

    nombre?:string
    apellido?:string
    nacimiento?: Date
    rol?: string
    
}
