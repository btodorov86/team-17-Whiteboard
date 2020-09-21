import { IsString, Length, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDTO {
    @IsString()
    @Length(1)
    firstName: string;
    @IsString()
    @Length(1)
    lastName: string;
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsString()
    @Length(6, 16)
    userName: string;
    @IsString()
    @Length(6, 16)
    password: string;
}
