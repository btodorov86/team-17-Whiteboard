import { IsString, Length, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsString()
    @Length(6, 16)
    password: string;
}
