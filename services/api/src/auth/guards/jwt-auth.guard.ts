import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const header = req.headers.authorization as string | undefined;
    if (!header?.startsWith("Bearer ")) {
      throw new UnauthorizedException({
        error: { code: "MISSING_TOKEN", message: "Bearer token required" },
      });
    }
    const token = header.slice(7);
    const payload = this.auth.verifyAccessToken(token);
    if (!payload) {
      throw new UnauthorizedException({
        error: { code: "INVALID_TOKEN", message: "Invalid or expired token" },
      });
    }
    req.user = payload;
    return true;
  }
}
