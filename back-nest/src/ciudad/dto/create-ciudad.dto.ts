import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCiudadDto {

    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsBoolean()
    @IsOptional()
    eliminado: boolean

}
