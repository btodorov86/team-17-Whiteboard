import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/user.module';
import { BooksModule } from './books/book.module';
import { RatingModule } from './rating/rating.module';
import { ReviewsModule } from './reviews/review.module';
import { ReactionModule } from './reaction/reaction.module';
import { IsBannedModule } from './isBanned/isBanned.module';
import { AuthController } from './auth/auth.controller';



@Module({
  imports: [
    CoreModule,
    TypeOrmModule.forRoot(),
    UsersModule,
    BooksModule,
    RatingModule,
    ReviewsModule,
    ReactionModule,
    IsBannedModule
  ],
  controllers: [AuthController],
  providers: [AppService],
})
export class AppModule {}
