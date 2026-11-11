import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes, ApiCookieAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { DocumentsService, UploadedBinaryInput } from "./documents.service";
import { CreateDocumentDto, MAX_DOCUMENT_SIZE_BYTES } from "./dto/document.dto";
import { SessionOrJwtAuthGuard } from "../../common/guards/auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { OptionalAuth } from "../../common/decorators/auth-access.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser, AuthenticatedUser } from "../../common/decorators/current-user.decorator";

@ApiTags("Document Management")
@Controller("documents")
@UseGuards(SessionOrJwtAuthGuard, RolesGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @OptionalAuth()
  @Get()
  @ApiOperation({ summary: "List accessible compliance and product documents" })
  async list(@CurrentUser() user: AuthenticatedUser | null) {
    return this.documentsService.listDocuments(user);
  }

  @Post()
  @Roles("ADMIN")
  @ApiCookieAuth("niventra_session")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Register a compliance or offering document (Admin only)" })
  async create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateDocumentDto) {
    return this.documentsService.registerDocument(dto, user);
  }

  @Post("upload")
  @Roles("ADMIN")
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: MAX_DOCUMENT_SIZE_BYTES, files: 1 },
    })
  )
  @ApiConsumes("multipart/form-data")
  @ApiCookieAuth("niventra_session")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Upload validated compliance document binary (Admin only)" })
  async upload(
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile() file: UploadedBinaryInput | undefined,
    @Body() dto: CreateDocumentDto
  ) {
    return this.documentsService.uploadDocumentBinary(file, dto, user);
  }

  @OptionalAuth()
  @Get(":id")
  @ApiOperation({ summary: "Retrieve metadata for a document" })
  async get(@CurrentUser() user: AuthenticatedUser | null, @Param("id") id: string) {
    return this.documentsService.getDocument(id, user);
  }

  @OptionalAuth()
  @Get(":id/download")
  @ApiOperation({ summary: "Download document binary or retrieve controlled access notice" })
  async download(
    @CurrentUser() user: AuthenticatedUser | null,
    @Param("id") id: string,
    @Res() res: Response
  ) {
    const outcome = await this.documentsService.downloadDocument(id, user);
    res.setHeader("X-Content-Type-Options", "nosniff");
    if (!outcome.isPublic) {
      res.setHeader("Cache-Control", "private, no-store");
    }

    if (outcome.mode === "FILE") {
      res.setHeader("Content-Type", outcome.mimeType);
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(outcome.downloadFilename)}"`
      );
      res.send(outcome.buffer);
      return;
    }

    res.json(outcome.payload);
  }
}
