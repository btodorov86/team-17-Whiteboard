import { IsString, MinLength, IsNotEmpty } from 'class-validator'

export class CreateBookDTO {
    @IsString()
    @MinLength(2)
    header: string
    @IsString()
    @MinLength(2)
    author: string
    @IsString()
    @IsNotEmpty()
    contents: string
}
