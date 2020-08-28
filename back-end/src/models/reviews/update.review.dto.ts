import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateReviewDTO {
    @IsString()
    @IsNotEmpty()
    contents: string;
}
