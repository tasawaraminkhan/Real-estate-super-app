import { Body, Controller, Get, Post, UseGuards, Req } from "@nestjs/common";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { IsString, MinLength, Matches } from "class-validator";

class OtpRequestDto {
  @IsString()
  @MinLength(10)
  phone!: string;
}

class OtpVerifyDto {
  @IsString()
  @MinLength(10)
  phone!: string;

  @IsString()
  @Matches(/^\d{6}$/)
  code!: string;
}

@ApiTags("auth")
@Controller({ path: "auth", version: "1" })
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("otp/request")
  requestOtp(@Body() dto: OtpRequestDto) {
    return this.auth.requestOtp(dto.phone);
  }

  @Post("otp/verify")
  verifyOtp(@Body() dto: OtpVerifyDto) {
    return this.auth.verifyOtp(dto.phone, dto.code);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  me(@Req() req: { user: { sub: string } }) {
    return this.auth.getMe(req.user.sub);
  }
}
