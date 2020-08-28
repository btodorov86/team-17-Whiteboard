import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { ReactionController } from './reaction.controller';

@Module({
    imports: [CoreModule],
    controllers: [ReactionController],
  })
export class ReactionModule {}
