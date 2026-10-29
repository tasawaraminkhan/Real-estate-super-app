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
  list(
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.propertiesService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? Math.min(parseInt(limit, 10), 50) : 20,
    );
  }

  @Get(":id")
  detail(@Param("id") id: string) {
    const prop = this.propertiesService.findOne(id);
    if (!prop) {
      return { error: { code: "NOT_FOUND", message: "Property not found" } };
    }
    return prop;
  }
}
