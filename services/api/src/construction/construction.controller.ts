import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ConstructionService } from "./construction.service";
import { IsNumber, IsString, IsOptional, IsIn, Min } from "class-validator";

class EstimateDto {
  @IsNumber() @Min(0.1) areaValue!: number;
  @IsString() areaUnit!: string;
  @IsOptional() @IsNumber() floors?: number;
  @IsIn(["GREY_STRUCTURE", "TURNKEY", "SEMI_FINISHED"]) constructionType!: "GREY_STRUCTURE" | "TURNKEY" | "SEMI_FINISHED";
  @IsIn(["ECONOMY", "STANDARD", "PREMIUM", "LUXURY"]) quality!: "ECONOMY" | "STANDARD" | "PREMIUM" | "LUXURY";
  @IsOptional() @IsString() city?: string;
}

@ApiTags("construction")
@Controller({ path: "construction", version: "1" })
export class ConstructionController {
  constructor(private readonly construction: ConstructionService) {}

  @Post("estimate")
  estimate(@Body() dto: EstimateDto) {
    return this.construction.estimate(dto);
  }
}
