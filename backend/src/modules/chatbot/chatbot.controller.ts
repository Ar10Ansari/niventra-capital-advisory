import { Controller, Post, Body } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ChatbotService } from "./chatbot.service";
import { ChatQueryDto } from "./dto/chat-query.dto";

@ApiTags("Institutional Chatbot")
@Controller("chat")
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  @ApiOperation({ summary: "Grounded institutional advisory Q&A retrieval" })
  query(@Body() dto: ChatQueryDto) {
    return this.chatbotService.query(dto.message);
  }
}
