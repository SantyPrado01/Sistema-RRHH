import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class RegisterDto{

    @Transform(({ value })=> value.trim())
    @IsString()
    @MinLength(4)
    username: string;

    @Transform(({ value })=> value.trim())
    @IsString()
    @MinLength(6)
    password: string;

    rolID: number;
    
}