import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { SavedSearchService } from "./saved-search.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { IsString, IsObject, IsOptional } from "class-validator";

class CreateDto {
  @IsString() name!: string;
  @IsOptional() @IsObject() filters?: Record<string, unknown>;
}

@ApiTags("saved-search")
@Controller({ path: "saved-searches", version: "1" })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SavedSearchController {
  constructor(private readonly svc: SavedSearchService) {}

  @Get()
  list(@Req() req: { user: { sub: string } }) {
    return this.svc.list(req.user.sub);
  }

  @Post()
  create(@Req() req: { user: { sub: string } }, @Body() dto: CreateDto) {
    return this.svc.create(req.user.sub, dto.name, dto.filters ?? {});
  }

  @Delete(":id")
  remove(@Req() req: { user: { sub: string } }, @Param("id") id: string) {
    return this.svc.remove(req.user.sub, id);
  }
}
