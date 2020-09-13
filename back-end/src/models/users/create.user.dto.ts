import { IsString, Length, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
    @IsString()
    @Length(2)
    firstName: string;
    @IsString()
    @Length(2)
    lastName: string;
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsString()
    @Length(2)
    userName: string;
    @IsString()
    @Length(6, 16)
    password: string;
}
