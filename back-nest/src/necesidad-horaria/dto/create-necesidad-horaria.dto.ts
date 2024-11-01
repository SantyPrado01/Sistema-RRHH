import { IsNotEmpty, IsNumber } from "class-validator"

export class CreateNecesidadHorariaDto {
    
    diaSemana: string

    horaInicio: string

    horaFin: string

}
