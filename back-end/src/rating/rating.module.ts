import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { RatingController } from './rating.controller';

@Module({
    imports: [CoreModule],
    controllers: [RatingController],
  })
export class RatingModule {}
