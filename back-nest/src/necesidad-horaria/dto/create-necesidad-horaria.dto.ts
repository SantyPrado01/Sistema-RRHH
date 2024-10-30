import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateNecesidadHorariaDto {

    @IsNotEmpty()
    @IsNumber()
    ordenTrabajoId:number
    
    diaSemana: number

    horaInicio: string

    horaFin: string

}
