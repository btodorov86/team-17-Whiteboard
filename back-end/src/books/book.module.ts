import { BooksController } from "./book.controller";
import { Module } from "@nestjs/common";
import { CoreModule } from "src/core/core.module";

@Module({
    imports: [CoreModule],
    controllers: [BooksController],
  })
  export class BooksModule {}