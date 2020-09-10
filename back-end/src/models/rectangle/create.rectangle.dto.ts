import { Length, IsString, IsNumber, IsPositive } from 'class-validator'

export class CreateRectangleDTO {
    @Length(1,)
    @IsString()
    color: string
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
