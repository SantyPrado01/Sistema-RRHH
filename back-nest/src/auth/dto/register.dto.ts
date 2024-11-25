import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";
import { Column, ManyToOne } from "typeorm";


export class RegisterDto{

    @Transform(({ value })=> value.trim())
    @IsString()
    @MinLength(4)
    userName: string;

    @Transform(({ value })=> value.trim())
    @IsString()
    @MinLength(6)
    password: string;

    @Column()
    categoriaId: number;

    @Column({default: false})
    eliminado: boolean

    @Column({default: true})
    primerIngreso: boolean
}