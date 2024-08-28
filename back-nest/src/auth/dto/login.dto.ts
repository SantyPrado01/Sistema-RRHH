import { Transform } from "class-transformer";
import { IsString, MinLength } from "class-validator";

export class loginDto{
    @Transform(({ value })=> value.trim())
    @IsString()
    @MinLength(4)
    username: string;

    @Transform(({ value })=> value.trim())
    @IsString()
    @MinLength(6)
    password: string;
}