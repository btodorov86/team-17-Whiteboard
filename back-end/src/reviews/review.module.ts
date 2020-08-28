import { ReviewsController } from "./review.controller";
import { Module } from "@nestjs/common";
import { CoreModule } from "src/core/core.module";

@Module({
    imports: [CoreModule],
    controllers: [ReviewsController],
  })
  export class ReviewsModule {}