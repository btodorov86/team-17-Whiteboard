import { Length, IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator'

export class CreateRectangleDTO {
    @Length(1,)
    @IsString()
    color: string
    @IsNumber()
    @IsNotEmpty()
    position: number;
    @IsNumber()
    @IsPositive()
    startX: number
    @IsNumber()
    @IsPositive()
    startY: number
    @IsNumber()
    @IsPositive()
    endX: number
    @IsNumber()
    @IsPositive()
    endY: number
    @Length(1,)
    @IsString()
    stroke: string
    @IsNumber()
    @IsPositive()
    strokeWidth: number
}
