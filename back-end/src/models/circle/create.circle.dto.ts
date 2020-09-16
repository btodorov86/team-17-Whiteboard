import { Length, IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator'
export class CreateCircleDTO {
    @IsNumber()
    @IsPositive()
    x: number;
    @IsNumber()
    @IsPositive()
    y: number;
    @IsNumber()
    @IsPositive()
    radius: number;
    @Length(1,)
    @IsString()
    stroke: string
    @IsString()
    fill: string
    @IsNumber()
    @IsPositive()
    strokeWidth: number
}
