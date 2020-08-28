import { UserRole } from 'src/core/enum/user-role.enum';
import { IsString, Length, IsEnum, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';
import { type } from 'os';

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
    @Length(2)
    password: string;
    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;
}
