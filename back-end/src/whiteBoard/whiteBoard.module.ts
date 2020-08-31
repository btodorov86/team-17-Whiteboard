import { WhiteBoardController } from "./whiteBoard.controller";
import { Module } from "@nestjs/common";
import { CoreModule } from "src/core/core.module";

@Module({
    imports: [CoreModule],
    controllers: [WhiteBoardController],
  })
  export class WhiteBoardModule {}
