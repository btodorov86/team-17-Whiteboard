import { Whiteboard } from '../whiteboard/whiteboard.entity';
import { Length, IsString, IsPositive } from 'class-validator'

export class CreateLineDTO {
    @Length(1, )
    @IsString()
    whiteboard: Whiteboard
    @Length(1, )
    @IsString()
    color: string
    @Length(3, )
    @IsString()
    points: string
    @Length(1, )
    @IsString()
    stroke: string
    @IsPositive()
    strokeWidth: number
}
