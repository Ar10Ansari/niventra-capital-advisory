import { Module } from "@nestjs/common";
import { DocumentsService } from "./documents.service";
import { DocumentsController } from "./documents.controller";
import { StorageAdapter } from "./storage/storage.adapter";

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, StorageAdapter],
  exports: [DocumentsService, StorageAdapter],
})
export class DocumentsModule {}
