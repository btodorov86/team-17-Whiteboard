import { Module } from '@nestjs/common';
import { IsBannedController } from './isBanned.controller';
import { CoreModule } from 'src/core/core.module';

@Module({
  imports: [CoreModule],
  controllers: [IsBannedController],
})
export class IsBannedModule {}
