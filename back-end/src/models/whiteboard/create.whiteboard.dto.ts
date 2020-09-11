import { Length, IsString, IsBoolean } from 'class-validator'
export class CreateWhiteboardDTO {
    @Length(1, )
    @IsString()
    name: string
    @IsBoolean()
    isPublic: boolean
}
