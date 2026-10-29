import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { ChatService } from "./chat.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { IsString } from "class-validator";

class OpenThreadDto {
  @IsString() propertyId!: string;
  @IsString() sellerId!: string;
}
class SendDto {
  @IsString() body!: string;
}

@ApiTags("chat")
@Controller({ path: "chat", version: "1" })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post("threads")
  open(@Req() req: { user: { sub: string } }, @Body() dto: OpenThreadDto) {
    return this.chat.getOrCreateThread(dto.propertyId, req.user.sub, dto.sellerId);
  }

  @Get("threads")
  list(@Req() req: { user: { sub: string } }) {
    return this.chat.threadsForUser(req.user.sub);
  }

  @Get("threads/:id/messages")
  messages(@Param("id") id: string) {
    return this.chat.listMessages(id);
  }

  @Post("threads/:id/messages")
  send(@Req() req: { user: { sub: string } }, @Param("id") id: string, @Body() dto: SendDto) {
    return this.chat.send(id, req.user.sub, dto.body);
  }
}
