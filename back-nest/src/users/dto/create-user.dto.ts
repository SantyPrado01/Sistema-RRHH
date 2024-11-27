import { Type } from "class-transformer"
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator"
import { CreateEmpleadoDto } from "src/empleados/dto/create-empleado.dto"
import { Empleado } from "src/empleados/entities/empleado.entity"

export class CreateUserDto {

    username: string
    password: string
    categoriaId: number
    eliminado:boolean
    primerIngreso: boolean

}