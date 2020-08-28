import { MinLength, IsString, IsNotEmpty } from 'class-validator'

export class UpdateBookDTO {
    @IsString()
    @MinLength(2)
    header: string
    @IsString()
    @MinLength(2)
    author: string
    @IsString()
    @IsNotEmpty()
    contents: string
    bookCover: string
}
