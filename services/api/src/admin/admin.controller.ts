import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AdminService } from "./admin.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { IsIn, IsOptional, IsString } from "class-validator";

class ModerateDto {
  @IsIn(["approve", "reject"]) action!: "approve" | "reject";
  @IsOptional() @IsString() reason?: string;
}

@ApiTags("admin")
@Controller({ path: "admin", version: "1" })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get("dashboard")
  dashboard() {
    return this.admin.dashboard();
  }

  @Get("moderation")
  queue() {
    return this.admin.moderationQueue();
  }

  @Post("moderation/:id")
  moderate(@Param("id") id: string, @Body() dto: ModerateDto) {
    return this.admin.moderate(id, dto.action, dto.reason);
  }
}
