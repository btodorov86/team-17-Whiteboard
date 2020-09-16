import { Length, IsString, IsPositive, IsNumber, IsNotEmpty } from 'class-validator'

export class CreateTextBoxDTO {
    @IsNumber()
    x: number
    @IsNumber()
    y: number;
    @IsString()
    @Length(1,)
    fill: string
    @IsString()
    @Length(1,)
    text: string
    @IsString()
    @Length(1,)
    fontStyle: string
    @IsString()
    textDecoration: string
    @IsNumber()
    fontSize: number
}
