import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class KycService {
  constructor(private readonly prisma: PrismaService) {}

  async submit(userId: string, cnic: string, fullName?: string) {
    const normalized = cnic.replace(/[-\s]/g, "");
    if (!/^\d{13}$/.test(normalized)) {
      throw new BadRequestException({ error: { code: "INVALID_CNIC", message: "CNIC must be 13 digits" } });
    }
    // Production: store encrypted + queue NADRA / manual review
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        verificationStatus: "PENDING",
        fullName: fullName || undefined,
        // cnic field if exists in schema — skip if not
      },
      select: { id: true, verificationStatus: true, fullName: true, phone: true },
    });
  }
}
