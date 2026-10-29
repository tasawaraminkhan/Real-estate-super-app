import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { MediaService } from "./media.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { IsString, IsInt, IsOptional, Min } from "class-validator";

class PresignDto {
  @IsString() propertyId!: string;
  @IsString() filename!: string;
  @IsString() contentType!: string;
}
class ConfirmDto {
  @IsString() propertyId!: string;
  @IsString() objectKey!: string;
  @IsOptional() @IsInt() @Min(0) sortOrder?: number;
}

@ApiTags("media")
@Controller({ path: "media", version: "1" })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Post("presign")
  presign(@Body() dto: PresignDto) {
    return this.media.presign(dto.propertyId, dto.filename, dto.contentType);
  }

  @Post("confirm")
  confirm(@Body() dto: ConfirmDto) {
    return this.media.confirm(dto.propertyId, dto.objectKey, dto.sortOrder ?? 0);
  }
}
