import { IsString, Length, IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserDTO {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    @IsString()
    @Length(2)
    password: string;
}
