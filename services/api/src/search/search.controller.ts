import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiQuery } from "@nestjs/swagger";
import { SearchService } from "./search.service";

@ApiTags("search")
@Controller({ path: "search", version: "1" })
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get("properties")
  @ApiQuery({ name: "purpose", required: false })
  @ApiQuery({ name: "category", required: false })
  @ApiQuery({ name: "cityId", required: false })
  @ApiQuery({ name: "priceMin", required: false })
  @ApiQuery({ name: "priceMax", required: false })
  @ApiQuery({ name: "areaMin", required: false })
  @ApiQuery({ name: "areaMax", required: false })
  @ApiQuery({ name: "bedroomsMin", required: false })
  @ApiQuery({ name: "sort", required: false })
  @ApiQuery({ name: "page", required: false })
  @ApiQuery({ name: "limit", required: false })
  search(
    @Query("purpose") purpose?: string,
    @Query("category") category?: string,
    @Query("cityId") cityId?: string,
    @Query("societyId") societyId?: string,
    @Query("priceMin") priceMin?: string,
    @Query("priceMax") priceMax?: string,
    @Query("areaMin") areaMin?: string,
    @Query("areaMax") areaMax?: string,
    @Query("bedroomsMin") bedroomsMin?: string,
    @Query("sort") sort?: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
  ) {
    return this.search.search({
      purpose,
      category,
      cityId,
      societyId,
      priceMin: priceMin ? parseInt(priceMin, 10) : undefined,
      priceMax: priceMax ? parseInt(priceMax, 10) : undefined,
      areaMin: areaMin ? parseFloat(areaMin) : undefined,
      areaMax: areaMax ? parseFloat(areaMax) : undefined,
      bedroomsMin: bedroomsMin ? parseInt(bedroomsMin, 10) : undefined,
      sort,
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
    });
  }
}
