import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpleadoDto } from './create-empleado.dto';
import { DisponibilidadHoraria } from 'src/disponibilidad-horaria/entities/disponibilidad-horaria.entity';

export class UpdateEmpleadoDto extends PartialType(CreateEmpleadoDto) {

    legajo?: number;
    nombre?: string;
    apellido?: string;
    nroDocumento?: number;
    telefono?: string;
    email?: string;
    fechaIngreso?: Date;
    eliminado?: boolean;
    ciudad?: number;
    observaciones?: string;
    categoriaId: number;
    disponibilidades?: DisponibilidadHoraria[];    
    fulltime?: boolean;
    horasCategoria?: number;
}
