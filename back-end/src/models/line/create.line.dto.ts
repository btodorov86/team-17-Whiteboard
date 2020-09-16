import { Length, IsString, IsPositive, IsNumber, IsNotEmpty } from 'class-validator'

export class CreateLineDTO {
    @Length(3, )
    @IsString()
    points: string
    @Length(1, )
    @IsString()
    stroke: string
    @IsNumber()
    @IsPositive()
    strokeWidth: number
}
