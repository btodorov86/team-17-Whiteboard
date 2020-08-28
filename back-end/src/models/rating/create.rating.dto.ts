import { RatingValue } from 'src/core/enum/rating.enum';
import { IsNotEmpty } from 'class-validator';

export class CreateRatingDTO {
    @IsNotEmpty()
    ratingValue: RatingValue;
}
