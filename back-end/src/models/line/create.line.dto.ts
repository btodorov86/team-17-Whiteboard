import { Length, IsString, IsPositive, IsNumber } from 'class-validator'

export class CreateLineDTO {
    @Length(2, )
    @IsString()
    points: string
    @Length(1, )
    @IsString()
    stroke: string
    @IsNumber()
    @IsPositive()
    strokeWidth: number
}
