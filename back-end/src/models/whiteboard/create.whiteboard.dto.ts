import { Length, IsString, IsBoolean } from 'class-validator';
export class CreateWhiteboardDTO {
  @Length(2)
  @IsString()
  name: string;
  @IsBoolean()
  isPublic: boolean;
}
