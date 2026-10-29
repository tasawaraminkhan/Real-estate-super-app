import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiTags, ApiQuery } from "@nestjs/swagger";
import { PropertiesService } from "./properties.service";

@ApiTags("properties")
@Controller({ path: "properties", version: "1" })
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  list(@Query("page") page?: string, @Query("limit") limit?: string) {
    return this.propertiesService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    );
  }

  @Get(":id")
  detail(@Param("id") id: string) {
    return this.propertiesService.findOne(id);
  }
}
