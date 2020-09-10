import { Length, IsString, IsPositive, IsNumber } from 'class-validator'

export class CreateTextBoxDTO {
    @Length(1, )
    @IsString()
    color: string
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
