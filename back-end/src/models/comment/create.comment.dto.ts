import { IsNotEmpty, IsNumber, isNumber, IsString } from 'class-validator';

export class CreateCommentDTO {
    @IsString()
    @IsNotEmpty()
    text: string;
    @IsNotEmpty()
    @IsNumber()
    x: number;
    @IsNotEmpty()
    @IsNumber()
    y: number;

}
