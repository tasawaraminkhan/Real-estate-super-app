import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { KycService } from "./kyc.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { IsString, IsOptional } from "class-validator";

class KycDto {
  @IsString() cnic!: string;
  @IsOptional() @IsString() fullName?: string;
}

@ApiTags("kyc")
@Controller({ path: "kyc", version: "1" })
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class KycController {
  constructor(private readonly kyc: KycService) {}

  @Post("submit")
  submit(@Req() req: { user: { sub: string } }, @Body() dto: KycDto) {
    return this.kyc.submit(req.user.sub, dto.cnic, dto.fullName);
  }
}
