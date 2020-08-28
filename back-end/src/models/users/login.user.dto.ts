import { IsString, Length, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class LoginUserDTO {
    @IsOptional()
    @IsString()
    @Length(2)
    userName?: string;
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsString()
    @Length(2)
    password: string;
}
