import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";
import { Column } from "typeorm";

export class RegisterDto{

    @Transform(({ value })=> value.trim())
    @IsString()
    @MinLength(4)
    username: string;

    @Transform(({ value })=> value.trim())
    password: string;

    @Column()
    categoriaId: number;

    @Column({default: false})
    eliminado: boolean

    @Column({default: true})
    primerIngreso: boolean
}