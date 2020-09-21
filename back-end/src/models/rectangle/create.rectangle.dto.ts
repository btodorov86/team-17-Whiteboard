import { Length, IsString, IsNumber, IsPositive } from 'class-validator';

export class CreateRectangleDTO {
  @IsNumber()
  @IsPositive()
  x: number
  @IsNumber()
  @IsPositive()
  y: number
  @IsNumber()
  height: number
  @IsNumber()
  width: number
  @Length(1)
  @IsString()
  stroke: string
  @IsString()
  fill: string
  @IsNumber()
  @IsPositive()
  strokeWidth: number
}
