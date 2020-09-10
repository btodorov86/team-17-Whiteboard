import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { TextBoxController } from './textBox.controller';

@Module({
  imports: [CoreModule],
  controllers: [TextBoxController],
})
export class TextBoxModule {}
