import { Length, IsString, IsBoolean, IsOptional } from 'class-validator';
export class UpdateWhiteboardDTO {
  @IsBoolean()
  isPublic: boolean;
  @Length(2)
  name: string;
//   @IsOptional()
//   @Length(2)
//   @IsString()
//   invitedUsersId?: string;
}
