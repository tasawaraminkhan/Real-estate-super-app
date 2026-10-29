import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { LeadsService } from "./leads.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { IsString, IsOptional } from "class-validator";

class CreateLeadDto {
  @IsString() propertyId!: string;
  @IsOptional() @IsString() buyerPhone?: string;
  @IsOptional() @IsString() buyerName?: string;
  @IsOptional() @IsString() source?: string;
  @IsOptional() @IsString() notes?: string;
}
class StageDto {
  @IsString() stage!: string;
}

@ApiTags("leads")
@Controller({ path: "leads", version: "1" })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LeadsController {
  constructor(private readonly leads: LeadsService) {}

  @Post()
  create(@Body() dto: CreateLeadDto) {
    return this.leads.create(dto);
  }

  @Get()
  list(@Query("agentId") agentId?: string) {
    return this.leads.list(agentId);
  }

  @Patch(":id/stage")
  stage(@Param("id") id: string, @Body() dto: StageDto) {
    return this.leads.updateStage(id, dto.stage);
  }
}
