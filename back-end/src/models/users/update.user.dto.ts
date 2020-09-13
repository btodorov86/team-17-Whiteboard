import { IsString, Length } from 'class-validator';

export class UpdateUserDTO {
    // @IsString()
    // @Length(2)
    // firstName: string;
    // @IsString()
    // @Length(2)
    // lastName: string;
    @IsString()
    @Length(1, 16)
    currentPassword: string;
    @IsString()
    @Length(6, 16)
    newPassword: string;
}
