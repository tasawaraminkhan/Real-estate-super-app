import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  TooManyRequestsException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { createHash, randomInt, randomBytes } from "crypto";

/** In-memory OTP store for Phase 1 (replace with Redis in production). */
const otpStore = new Map<
  string,
  { code: string; attempts: number; expiresAt: number }
>();

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private hashToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  async requestOtp(phone: string): Promise<{ message: string; devOtp?: string }> {
    const normalized = phone.replace(/\s+/g, "").replace(/^\+?92/, "0");
    if (!/^03\d{9}$/.test(normalized) && !/^\+923\d{9}$/.test(phone.replace(/\s/g, ""))) {
      // Allow flexible formats in dev
      if (normalized.length < 10) {
        throw new BadRequestException({
          error: { code: "INVALID_PHONE", message: "Valid Pakistani phone number required" },
        });
      }
    }

    const code = String(randomInt(100000, 999999));
    otpStore.set(normalized, {
      code,
      attempts: 0,
      expiresAt: Date.now() + OTP_TTL_MS,
    });

    const isDev = process.env.NODE_ENV !== "production";
    return {
      message: "OTP sent",
      ...(isDev ? { devOtp: code } : {}),
    };
  }

  async verifyOtp(phone: string, code: string) {
    const normalized = phone.replace(/\s+/g, "").replace(/^\+?92/, "0");
    const entry = otpStore.get(normalized);

    if (!entry) {
      throw new UnauthorizedException({
        error: { code: "OTP_NOT_FOUND", message: "Request OTP first" },
      });
    }
    if (Date.now() > entry.expiresAt) {
      otpStore.delete(normalized);
      throw new UnauthorizedException({
        error: { code: "OTP_EXPIRED", message: "OTP expired" },
      });
    }
    if (entry.attempts >= MAX_ATTEMPTS) {
      otpStore.delete(normalized);
      throw new TooManyRequestsException({
        error: { code: "OTP_LOCKED", message: "Too many attempts" },
      });
    }
    if (entry.code !== code) {
      entry.attempts += 1;
      throw new UnauthorizedException({
        error: { code: "OTP_INVALID", message: "Invalid OTP" },
      });
    }

    otpStore.delete(normalized);

    let user = await this.prisma.user.findUnique({ where: { phone: normalized } });
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone: normalized,
          role: "BUYER",
          verificationStatus: "UNVERIFIED",
        },
      });
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });
    }

    const accessToken = this.issueAccessToken(user.id, user.role);
    const refreshToken = randomBytes(48).toString("hex");
    // Store refresh hash would go to Redis/DB — simplified for Phase 1

    return {
      accessToken,
      refreshToken,
      expiresIn: 900,
      user: {
        id: user.id,
        phone: user.phone,
        fullName: user.fullName,
        role: user.role,
        verificationStatus: user.verificationStatus,
        locale: user.locale,
      },
    };
  }

  issueAccessToken(userId: string, role: string): string {
    // Lightweight JWT-like payload (use @nestjs/jwt + real secrets in production)
    const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
    const payload = Buffer.from(
      JSON.stringify({
        sub: userId,
        role,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 900,
      }),
    ).toString("base64url");
    const secret = process.env.JWT_ACCESS_SECRET ?? "dev-secret-change-me";
    const sig = createHash("sha256")
      .update(`${header}.${payload}.${secret}`)
      .digest("base64url");
    return `${header}.${payload}.${sig}`;
  }

  verifyAccessToken(token: string): { sub: string; role: string } | null {
    try {
      const [header, payload, sig] = token.split(".");
      if (!header || !payload || !sig) return null;
      const secret = process.env.JWT_ACCESS_SECRET ?? "dev-secret-change-me";
      const expected = createHash("sha256")
        .update(`${header}.${payload}.${secret}`)
        .digest("base64url");
      if (sig !== expected) return null;
      const data = JSON.parse(Buffer.from(payload, "base64url").toString());
      if (data.exp < Math.floor(Date.now() / 1000)) return null;
      return { sub: data.sub, role: data.role };
    } catch {
      return null;
    }
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        email: true,
        fullName: true,
        role: true,
        verificationStatus: true,
        locale: true,
        avatarUrl: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException({
        error: { code: "USER_NOT_FOUND", message: "User not found" },
      });
    }
    return user;
  }
}
