import { Length, IsString, IsOptional } from 'class-validator';
export class UpdateInvitedUsersDTO {
  @IsOptional()
  @Length(2)
  @IsString()
  invitedUsersId?: string;
}
