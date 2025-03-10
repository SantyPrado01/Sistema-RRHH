import { IsNotEmpty, IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateHorariosAsignadoDto } from 'src/horariosAsignados/dto/createHorariosAsignados.dto'; 
import { Servicio } from 'src/servicios/entities/servicio.entity';
import { Empleado } from 'src/empleados/entities/empleado.entity';
import { CreateNecesidadHorariaDto } from 'src/necesidadHoraria/dto/createNecesidadHoraria.dto'; 

export class CreateOrdenTrabajoDto {

    @IsNotEmpty()
    servicio: Servicio;

    @IsNotEmpty()
    empleadoAsignado: Empleado;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateHorariosAsignadoDto)
    horariosAsignados?: CreateHorariosAsignadoDto[]; 

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => CreateNecesidadHorariaDto)
    necesidadHoraria?: CreateNecesidadHorariaDto[];


}