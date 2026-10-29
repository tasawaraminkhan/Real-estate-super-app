import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiQuery, ApiBearerAuth } from "@nestjs/swagger";
import { PropertiesService } from "./properties.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@ApiTags("properties")
@Controller({ path: "properties", version: "1" })
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  list(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.propertiesService.findAll(page ? parseInt(page, 10) : 1, limit ? parseInt(limit, 10) : 20);
  }

  @Get("me/list")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  mine(@Req() req: { user: { sub: string } }) {
    return this.propertiesService.myListings(req.user.sub);
  }

  @Get("favourites")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  favs(@Req() req: { user: { sub: string } }) {
    return this.propertiesService.listFavourites(req.user.sub);
  }

  @Get(":id")
  detail(@Param("id") id: string) {
    return this.propertiesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Req() req: { user: { sub: string } }, @Body() body: Record<string, unknown>) {
    return this.propertiesService.createDraft(req.user.sub, body);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Req() req: { user: { sub: string } }, @Param("id") id: string, @Body() body: Record<string, unknown>) {
    return this.propertiesService.update(req.user.sub, id, body);
  }

  @Post(":id/submit")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  submit(@Req() req: { user: { sub: string } }, @Param("id") id: string) {
    return this.propertiesService.submit(req.user.sub, id);
  }

  @Post(":id/favourite")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  favourite(@Req() req: { user: { sub: string } }, @Param("id") id: string) {
    return this.propertiesService.toggleFavourite(req.user.sub, id);
  }
}
