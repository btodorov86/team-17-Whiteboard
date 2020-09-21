import { IsString, Length } from 'class-validator';

export class UpdateUserDTO {
    @IsString()
    @Length(6, 16)
    currentPassword: string;
    @IsString()
    @Length(6, 16)
    newPassword: string;
}
