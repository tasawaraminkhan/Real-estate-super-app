import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { BillingService } from "./billing.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { IsString, IsOptional } from "class-validator";

class IntentDto {
  @IsString() planCode!: string;
  @IsOptional() @IsString() provider?: string;
}
class ConfirmDto {
  @IsString() transactionId!: string;
}
class FeatureDto {
  @IsString() propertyId!: string;
}

@ApiTags("billing")
@Controller({ path: "billing", version: "1" })
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get("plans")
  plans() {
    return this.billing.listPlans();
  }

  @Post("seed-plans")
  seed() {
    return this.billing.ensurePlans();
  }

  @Post("intent")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  intent(@Req() req: { user: { sub: string } }, @Body() dto: IntentDto) {
    return this.billing.createPaymentIntent(req.user.sub, dto.planCode, dto.provider ?? "mock");
  }

  @Post("confirm")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  confirm(@Body() dto: ConfirmDto) {
    return this.billing.confirmPayment(dto.transactionId);
  }

  @Post("feature")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  feature(@Req() req: { user: { sub: string } }, @Body() dto: FeatureDto) {
    return this.billing.featureListing(req.user.sub, dto.propertyId);
  }
}
