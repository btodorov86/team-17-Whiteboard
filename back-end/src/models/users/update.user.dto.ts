import { IsString, Length } from 'class-validator';

export class UpdateUserDTO {
    @IsString()
    @Length(2)
    firstName: string;
    @IsString()
    @Length(2)
    lastName: string;
    @IsString()
    @Length(2)
    password: string;
}
